// Copyright (c) 2018 Serial Lab
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
import PageForm from "components/elements/PageForm";
import {reduxForm} from "redux-form";
import {deleteStepParam} from "../reducers/capture";

const StepForm = reduxForm({
  form: "stepForm"
})(PageForm);

class _AddStep extends Component {
  constructor(props) {
    super(props);
    let rule = this.getRule(this.props.rules, this.props.match);
    let step = this.getStep(rule, this.props.match);
    this.state = {
      rule: rule,
      step: step
    };
  }
  getRule(rules, match) {
    return rules.find(rule => {
      return Number(rule.id) === Number(match.params.ruleID);
    });
  }
  editStepParam(param) {
    const {server} = this.props;
    let step = this.getStep(this.state.rule, this.props.match);
    if (step) {
      this.props.history.push({
        pathname: `/capture/edit-step-param/${server.serverID}/rule/${
          step.rule
        }/step/${step.id}/stepParam/${param.id}`,
        state: {defaultValues: param, edit: true}
      });
    }
  }
  componentDidMount() {
    let rule = this.getRule(this.props.rules, this.props.match);
    let step = this.getStep(rule, this.props.match);
    this.setState({rule: rule, step: step});
  }
  componentWillReceiveProps(nextProps) {
    let rule = this.getRule(nextProps.rules, nextProps.match);
    let step = this.getStep(rule, nextProps.match);
    this.setState({rule: rule, step: step});
  }
  deleteStepParam(param) {
    this.props.deleteStepParam(this.props.server, param);
  }
  getStep(rule = null, match = null) {
    if (rule && match) {
      return rule.steps.find(step => {
        return Number(step.id) === Number(match.params.stepID);
      });
    } else if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      return this.props.location.state.defaultValues;
    }
    return null;
  }
  render() {
    let {step, rule} = this.state;
    let editMode = step ? true : false;
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.capture.addStep" />
          ) : (
            <FormattedMessage id="plugins.capture.editStep" />
          )
        }>
        <div className="large-cards-container">
          <Card className="pt-elevation-4 form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.capture.addStep" />
              ) : (
                <FormattedMessage id="plugins.capture.editStep" />
              )}{" "}
              to {rule.name}
            </h5>
            <StepForm
              edit={editMode}
              operationId={
                editMode ? "capture_steps_update" : "capture_steps_create"
              }
              objectName="step"
              redirectPath={`/capture/rules/${this.props.server.serverID}/`}
              djangoPath="capture/steps/"
              existingValues={step}
              prepopulatedValues={[{name: "rule", value: rule.id}]}
              parameters={step ? {id: step.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
          {editMode ? (
            <Card className="pt-elevation-4 form-card">
              <h5>
                <button
                  className="pt-button right-aligned-elem pt-interactive pt-intent-primary"
                  onClick={e => {
                    this.props.history.push(
                      `/capture/add-step-param/${
                        this.props.server.serverID
                      }/rule/${step.rule}/step/${step.id}`
                    );
                  }}>
                  <FormattedMessage id="plugins.capture.addStepParam" />
                </button>
                <FormattedMessage id="plugins.capture.stepParameters" />
              </h5>

              {Array.isArray(step.params) && step.params.length > 0 ? (
                <table className="pt-table pt-interactive pt-bordered pt-striped">
                  <thead>
                    <th>
                      <FormattedMessage
                        id="plugins.capture.name"
                        defaultMessage="Name"
                      />
                    </th>
                    <th>
                      {" "}
                      <FormattedMessage
                        id="plugins.capture.value"
                        defaultMessage="Value"
                      />
                    </th>
                    <th> </th>
                  </thead>
                  <tbody>
                    {step.params.map(param => {
                      return (
                        <tr key={param.id}>
                          <td>{param.name}</td>
                          <td>{param.value}</td>
                          <td style={{width: "80px"}}>
                            <ButtonGroup minimal={true} small={true}>
                              <Button
                                small={true}
                                iconName="edit"
                                onClick={this.editStepParam.bind(this, param)}
                              />
                              <Button
                                small={true}
                                iconName="trash"
                                onClick={this.deleteStepParam.bind(this, param)}
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

export const AddStep = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      rules: state.capture.servers
        ? state.capture.servers[ownProps.match.params.serverID].rules
        : []
    };
  },
  {deleteStepParam}
)(_AddStep);
