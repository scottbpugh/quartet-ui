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
    const rule = this.getRule(this.props.rules, this.props.match);
    const step = this.getStep(rule, this.props.match);
    this.state = {
      rule,
      step
    };
  }

  getRule(rules, match) {
    return rules.find(rule => {
      return Number(rule.id) === Number(match.params.ruleID);
    });
  }

  editStepParam(param) {
    const {server} = this.props;
    const step = this.getStep(this.state.rule, this.props.match);
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
    const rule = this.getRule(this.props.rules, this.props.match);
    const step = this.getStep(rule, this.props.match);
    this.setState({rule, step});
  }

  componentWillReceiveProps(nextProps) {
    const rule = this.getRule(nextProps.rules, nextProps.match);
    const step = this.getStep(rule, nextProps.match);
    this.setState({rule, step});
  }

  deleteStepParam(param) {
    this.props.deleteStepParam(this.props.server, param);
  }

  getStep(rule = null, match = null) {
    if (rule && match) {
      return rule.steps.find(step => {
        return Number(step.id) === Number(match.params.stepID);
      });
    }
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      return this.props.location.state.defaultValues;
    }
    return null;
  }

  render() {
    const {step, rule} = this.state;
    const editMode = !!step;
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
          <Card className=" bp3-elevation-1 form-card">
            <h5 className="bp3-heading">
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
            <Card className=" bp3-elevation-1 form-card">
              <h5 className="bp3-heading">
                <button
                  className="bp3-button right-aligned-elem bp3-interactive bp3-intent-primary"
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
                <table className="paginated-list-table bp3-html-table bp3=small bp3-html-table-bordered bp3-html-table-striped">
                  <thead>
                    <tr>
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
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {step.params.map(param => {
                      return (
                        <tr key={param.id}>
                          <td>{param.name}</td>
                          <td>{param.value}</td>
                          <td style={{width: "80px"}}>
                            <ButtonGroup minimal small>
                              <Button
                                small="true"
                                icon="edit"
                                onClick={this.editStepParam.bind(this, param)}
                              />
                              <Button
                                small="true"
                                icon="trash"
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
