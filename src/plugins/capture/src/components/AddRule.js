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

import React, {Component} from "react";
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {Card} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {pluginRegistry} from "plugins/pluginRegistration";
import {reduxForm} from "redux-form";
import PageForm from "components/elements/PageForm";
import {loadRules} from "../reducers/capture";

const RuleForm = reduxForm({
  form: "ruleForm"
})(PageForm);

class _AddRule extends Component {
  componentDidMount() {
    // reload all rules.
    this.props.loadRules(this.props.server);
  }
  render() {
    let rule = null; // for edit only.
    let editMode = this.props.rule ? true : false;
    if (this.props.rule) {
      rule = this.props.rule;
    }
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.capture.addRule" />
          ) : (
            <FormattedMessage id="plugins.capture.editRule" />
          )
        }>
        <div className="large-cards-container">
          <Card className="pt-elevation-4 form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.capture.addRule" />
              ) : (
                <FormattedMessage id="plugins.capture.editRule" />
              )}
            </h5>
            <RuleForm
              edit={editMode}
              operationId={
                editMode ? "capture_rules_update" : "capture_rules_create"
              }
              objectName="rule"
              redirectPath={`/capture/rules/${this.props.server.serverID}`}
              djangoPath="capture/rules/"
              existingValues={rule}
              parameters={rule ? {id: rule.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
          {editMode ? (
            <Card className="pt-elevation-4 form-card">
              <h5>
                <button
                  className="pt-button right-aligned-elem pt-intent-primary"
                  onClick={e => {
                    this.props.history.push(
                      `/capture/add-rule-param/${
                        this.props.server.serverID
                      }/rule/${rule.id}`
                    );
                  }}>
                  <FormattedMessage id="plugins.capture.addRuleParameter" />
                </button>
                <FormattedMessage id="plugins.capture.ruleParameters" />
              </h5>

              {Array.isArray(rule.params) && rule.params.length > 0 ? (
                <table className="pt-table pt-bordered pt-striped">
                  <thead>
                    <th>
                      <FormattedMessage
                        id="plugins.capture.name"
                        defaultMessage="name"
                      />
                    </th>
                    <th>
                      {" "}
                      <FormattedMessage
                        id="plugins.capture.value"
                        defaultMessage="value"
                      />
                    </th>
                  </thead>
                  <tbody>
                    {rule.params.map(param => {
                      return (
                        <tr key={param.id}>
                          <td>{param.name}</td>
                          <td>{param.value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : null}
            </Card>
          ) : null}
        </div>
      </RightPanel>
    );
  }
}

export const AddRule = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      rule: ownProps.match.params.ruleID
        ? state.capture.servers[ownProps.match.params.serverID].rules.find(
            rule => {
              return Number(rule.id) === Number(ownProps.match.params.ruleID);
            }
          )
        : null
    };
  },
  {loadRules}
)(_AddRule);
