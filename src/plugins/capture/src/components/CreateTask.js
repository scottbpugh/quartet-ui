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
import TaskForm from "./TaskForm";

class _AddTask extends Component {
  componentDidMount() {}

  render() {
    const rule = this.props.rules.find(rule => {
      return Number(rule.id) === Number(this.props.match.params.ruleID);
    });
    const editMode = !!(this.props.location
      && this.props.location.state
      && this.props.location.state.editPool);
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.capture.addTask" />
          ) : (
            <FormattedMessage id="plugins.capture.editTask" />
          )
        }
      >
        <div className="large-cards-container">
          <Card className="bp3-elevation-1form-card">
            <h5 className="bp3-heading">
              {!editMode ? (
                <FormattedMessage id="plugins.capture.addTask" />
              ) : (
                <FormattedMessage id="plugins.capture.editTask" />
              )}
              {" "}
              to
              {' '}
              {rule.name}
            </h5>
            <TaskForm
              rule={rule}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddTask = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID],
    rules: state.capture.servers
      ? state.capture.servers[ownProps.match.params.serverID].rules
      : []
  };
})(_AddTask);
