// Copyright (c) 2018 SerialLab Corp.
//
// GNU GENERAL PUBLIC LICENSE
//    Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

const React = qu4rtet.require("react");
const {Component} = React;
const {Card, TextArea, Intent} = qu4rtet.require("@blueprintjs/core");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const PageForm = qu4rtet.require("./components/elements/PageForm").default;
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {reduxForm} = qu4rtet.require("redux-form");
const {connect} = qu4rtet.require("react-redux");
const changeFieldValue = qu4rtet.require("redux-form").change;
const {FormattedMessage} = qu4rtet.require("react-intl");

const TemplateForm = reduxForm({
  form: "TemplateForm"
})(PageForm);

class TemplateContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.existingValues ? this.props.existingValues.content : ""
    };
  }
  handleChange = evt => {
    this.setState({content: evt.target.value});
  };
  updateField = evt => {
    this.props.changeFieldValue("TemplateForm", "content", evt.target.value);
  };
  componentWillMount() {}
  render() {
    return (
      <TextArea
        style={{minHeight: "400px"}}
        onChange={this.handleChange}
        onBlur={this.updateField}
        value={this.state.content}
      />
    );
  }
}

export class _AddTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: []
    };
  }

  render() {
    let template = null;
    const editMode = !!(
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.edit
    );
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      template = this.props.location.state.defaultValues;
    }
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.templates.addTemplate" />
          ) : (
            <FormattedMessage id="plugins.templates.editTemplate" />
          )
        }>
        <div className="large-cards-container full-form-container">
          <Card className="form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.templates.addTemplate" />
              ) : (
                <FormattedMessage id="plugins.templates.editTemplate" />
              )}
            </h5>
            <TemplateForm
              edit={false}
              operationId={
                editMode
                  ? "templates_templates_update"
                  : "templates_templates_create"
              }
              objectName="template"
              djangoPath="templates/templates/"
              existingValues={template}
              redirectPath={`/templates/${
                this.props.server.serverID
              }/templates/`}
              parameters={template ? {id: template.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
              fieldElements={{
                content: (
                  <TemplateContent
                    {...this.props}
                    formName="TemplateForm"
                    changeFieldValue={this.props.changeFieldValue}
                    existingValues={template}
                  />
                )
              }}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddTemplate = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID]
    };
  },
  {changeFieldValue}
)(_AddTemplate);
