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
import {Card, Button, ButtonGroup} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {pluginRegistry} from "plugins/pluginRegistration";
import {reduxForm} from "redux-form";
import PageForm from "components/elements/PageForm";
import {loadRules, deleteRuleParam} from "../reducers/capture";

const RuleForm = reduxForm({
  form: "ruleForm"
})(PageForm);

class _AddRule extends Component {
  componentDidMount() {
    // reload all rules.
    this.props.loadRules(this.props.server);
  }

  editRuleParam(param) {
    const {server, rule} = this.props;
    this.props.history.push({
      pathname: `/capture/edit-rule-param/${server.serverID}/rule/${
        rule.id
      }/ruleParam/${param.id}`,
      state: {defaultValues: param, edit: true}
    });
  }

  deleteRuleParam(param) {
    this.props.deleteRuleParam(this.props.server, param);
  }

  render() {
    let rule = null; // for edit only.
    const editMode = !!this.props.rule;
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
          <Card className="bp3-elevation-4 form-card">
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
            <Card className="bp3-elevation-4 form-card">
              <h5>
                <button
                  className="bp3-button right-aligned-elem bp3-interactive bp3-intent-primary"
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
                <table className="bp3-table bp3-interactive bp3-bordered bp3-striped">
                  <thead>
                    <tr>
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
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {rule.params.map(param => {
                      return (
                        <tr key={param.id}>
                          <td>{param.name}</td>
                          <td>{param.value}</td>
                          <td style={{width: "80px"}}>
                            <ButtonGroup minimal small>
                              <Button
                                small="true"
                                iconName="edit"
                                onClick={this.editRuleParam.bind(this, param)}
                              />
                              <Button
                                small="true"
                                iconName="trash"
                                onClick={this.deleteRuleParam.bind(this, param)}
                              />
                            </ButtonGroup>
                          </td>
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
  {loadRules, deleteRuleParam}
)(_AddRule);
