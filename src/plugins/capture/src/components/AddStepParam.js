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
import PageForm from "components/elements/PageForm";
import {reduxForm} from "redux-form";
import {loadRules} from "../reducers/capture";

const StepParamForm = reduxForm({
  form: "stepParamForm"
})(PageForm);

class _AddStepParam extends Component {
  submitCallback() {
    // refresh rules Lists and children when param is saved.
    this.props.loadRules(this.props.server);
  }

  render() {
    const rule = this.props.rules.find(rule => {
      return Number(rule.id) === Number(this.props.match.params.ruleID);
    });
    let step = null;
    if (rule) {
      step = rule.steps.find(step => {
        return Number(step.id) === Number(this.props.match.params.stepID);
      });
    }
    let stepParam = null;
    const editMode = !!(this.props.location
      && this.props.location.state
      && this.props.location.state.edit);
    if (
      this.props.location
      && this.props.location.state
      && this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      stepParam = this.props.location.state.defaultValues;
    }
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.capture.addStepParam" />
          ) : (
            <FormattedMessage id="plugins.capture.editStepParam" />
          )
        }
      >
        <div className="large-cards-container">
          <Card className=" bp3-elevation-1 form-card">
            <h5 className="bp3-heading">
              {!editMode ? (
                <FormattedMessage id="plugins.capture.addStepParam" />
              ) : (
                <FormattedMessage id="plugins.capture.editStepParam" />
              )}
            </h5>
            <StepParamForm
              edit={editMode}
              operationId={
                editMode
                  ? "capture_step_parameters_update"
                  : "capture_step_parameters_create"
              }
              objectName="Step Parameter"
              submitCallback={this.submitCallback.bind(this)}
              redirectPath={`/capture/edit-rule/${
                this.props.server.serverID
              }/rule/${rule.id}/step/${step.id}?stepEdit=True`}
              djangoPath="capture/step-parameters/"
              existingValues={stepParam}
              prepopulatedValues={[{name: "step", value: step.id}]}
              parameters={stepParam ? {id: stepParam.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddStepParam = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      rules: state.capture.servers
        ? state.capture.servers[ownProps.match.params.serverID].rules
        : []
    };
  },
  {loadRules}
)(_AddStepParam);
