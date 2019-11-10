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

import {loadPoolList} from "../reducers/numberrange";
const React = qu4rtet.require("react");
const {Component} = React;
const {connect} = qu4rtet.require("react-redux");
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {Card} = qu4rtet.require("@blueprintjs/core");
const {FormattedMessage} = qu4rtet.require("react-intl");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const PageForm = qu4rtet.require("./components/elements/PageForm").default;
const {Field, reduxForm, SubmissionError, change} = qu4rtet.require(
  "redux-form"
);
const loadRules = qu4rtet.require("./plugins/capture/src/reducers/capture");
import {RuleDialog} from "./Dialogs/RuleDialog";

const ResponseRuleForm = reduxForm({
  form: "responseRuleForm"
})(PageForm);

class _AddResponseRule extends Component {
  constructor(props) {

    super(props);
    this.state = {
      formStructure: [],
      isRuleOpen: false
    };

  }
  submitCallback() {
    this.props.loadPoolList(this.props.server);
  }

  toggleRuleDialog = evt => {
    this.setState({isRuleOpen: !this.state.isRuleOpen});
  };

  render() {
    const editMode = !!(this.props.location
                        && this.props.location.state
                        && this.props.location.state.edit);
    let responseRule = null;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      responseRule = this.props.location.state.defaultValues;
    } else {
      responseRule = {};
    }
    const pool = this.props.location.state.pool;

    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.numberRange.addResponseRule" />
          ) : (
            <FormattedMessage id="plugins.numberRange.editResponseRule" />
          )
        }
      >
        <div className="large-cards-container">
          <Card className="bp3-elevation-4 form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.numberRange.addResponseRule" />
              ) : (
                <FormattedMessage id="plugins.numberRange.editResponseRule" />
              )}
            </h5>
            <div style={{textAlign: "center"}}><span>{pool.readable_name}</span></div>
            <ResponseRuleForm
              edit={editMode}
              operationId={
                editMode
                  ? "serialbox_response_rules_update"
                  : "serialbox_response_rules_create"
              }
              objectName="Response Rule"
              submitCallback={this.submitCallback.bind(this)}
              redirectPath={`/number-range/edit-pool/${this.props.server.serverID}/${pool.machine_name}`}
              djangoPath="serialbox/response-rules/"
              existingValues={responseRule}
              prepopulatedValues={[{name: "pool", value: pool.id}]}
              parameters={responseRule ? {id: responseRule.id} : {}}
              fieldElements={{
                rule: (
                  <RuleDialog
                    {...this.props}
                    server={this.props.server}
                    formName={"responseRuleForm"}
                    changeFieldValue={this.props.change}
                    isRuleOpen={this.state.isRuleOpen}
                    existingValues={responseRule}
                    loadEntries={
                      this.props.rules ? () => {} : this.props.loadRules
                    }
                    toggleRuleDialog={this.toggleRuleDialog}
                    entries={this.props.rules || []}
                  />
                )
              }}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>

    );
  }
}

export const AddResponseRule = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      rules: state.capture.servers
        ? state.capture.servers[ownProps.match.params.serverID].rules
        : [],
      theme: state.layout.theme
    };
  },
  {loadRules, change, loadPoolList}
)(_AddResponseRule);
