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
import {Card} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {pluginRegistry} from "plugins/pluginRegistration";
import PageForm from "components/elements/PageForm";
import {reduxForm} from "redux-form";

const StepForm = reduxForm({
  form: "stepForm"
})(PageForm);

class _AddStep extends Component {
  componentDidMount() {}
  render() {
    const rule = this.props.rules.find(rule => {
      return Number(rule.id) === Number(this.props.match.params.ruleID);
    });
    let step = null;
    let editMode =
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.edit
        ? true
        : false;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      step = this.props.location.state.defaultValues;
    }
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
              redirectPath={`/capture/rules/${this.props.server.serverID}`}
              djangoPath="capture/steps/"
              existingValues={step}
              prepopulatedValues={[{name: "rule", value: rule.id}]}
              parameters={step ? {id: step.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddStep = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID],
    rules: state.capture.servers
      ? state.capture.servers[ownProps.match.params.serverID].rules
      : []
  };
})(_AddStep);
