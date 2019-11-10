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
const {Card} = qu4rtet.require("@blueprintjs/core");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const PageForm = qu4rtet.require("./components/elements/PageForm").default;
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {reduxForm} = qu4rtet.require("redux-form");
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");

const EndpointForm = reduxForm({
  form: "EndpointForm"
})(PageForm);

export class _AddEndpoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: []
    };
  }

  render() {
    let endpoint = null;
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
      endpoint = this.props.location.state.defaultValues;
    }
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.output.addEndpoint" />
          ) : (
            <FormattedMessage id="plugins.output.editEndpoint" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.output.addEndpoint" />
              ) : (
                <FormattedMessage id="plugins.output.editEndpoint" />
              )}
            </h5>
            <EndpointForm
              edit={false}
              operationId={
                editMode
                  ? "output_end_points_update"
                  : "output_end_points_create"
              }
              objectName="endpoint"
              djangoPath="output/end-points/"
              existingValues={endpoint}
              redirectPath={`/output/${this.props.server.serverID}/endpoints/`}
              parameters={endpoint ? {id: endpoint.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddEndpoint = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID]
  };
}, {})(_AddEndpoint);
