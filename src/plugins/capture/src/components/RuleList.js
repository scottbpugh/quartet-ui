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
import {loadRules, loadTasks} from "../reducers/capture";
import {Card, Tag, Intent} from "@blueprintjs/core";

import {FormattedMessage} from "react-intl";
import {pluginRegistry} from "plugins/pluginRegistration";
import "./RuleList.css";
import {ServerTasks} from "./ServerTasks";

class ServerRules extends Component {
  render() {
    let serverName = this.props.server.serverSettingName;
    let serverID = this.props.server.serverID;
    let {tasks, rules} = this.props;
    if (!tasks) {
      tasks = [];
    }
    return (
      <Card className="pt-elevation-4">
        <h5>
          <button
            className="pt-button right-aligned-elem pt-intent-primary"
            onClick={e => {
              this.props.history.push(`/capture/add-rule/${serverID}/rule`);
            }}>
            <FormattedMessage id="plugins.capture.addRule" />
          </button>
          {serverName} Rules
        </h5>
        <div />
        <div>
          <table className="pool-list-table pt-table pt-bordered pt-striped">
            <thead>
              <tr>
                <th>
                  <FormattedMessage
                    id="plugins.capture.name"
                    defaultMessage="Name"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="plugins.capture.description"
                    defaultMessage="Description"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="plugins.capture.steps"
                    defaultMessage="Steps"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="plugins.capture.tasks"
                    defaultMessage="Tasks"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(rules) && rules.length > 0
                ? rules.map(rule => {
                    return (
                      <tr>
                        <td>
                          {rule.name.charAt(0).toUpperCase() +
                            rule.name.slice(1)}
                        </td>
                        <td>{rule.description}</td>
                        <td>
                          {rule.steps.map(step => (
                            <Tag intent={Intent.PRIMARY} className="step">
                              #{step.order} {step.name}
                            </Tag>
                          ))}
                        </td>
                        <td>
                          {
                            tasks.filter(task => {
                              return task.rule === rule.id;
                            }).length
                          }
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }
}

class _RuleList extends Component {
  constructor(props) {
    super(props);
    this.fetchTasks = null;
  }
  componentDidMount() {
    const {server} = this.props;
    this.props.loadTasks(pluginRegistry.getServer(server.serverID));
    this.fetchTasks = setInterval(() => {
      this.props.loadTasks(pluginRegistry.getServer(server.serverID));
    }, 5000);
    this.props.loadRules(pluginRegistry.getServer(server.serverID));
  }
  componentWillUnmount() {
    clearInterval(this.fetchTasks);
    this.fetchTasks = null;
  }
  render() {
    let {server, rules, tasks} = this.props;
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.capture.captureRules"
            defaultMessage="Capture Rules"
          />
        }>
        <div className="large-cards-container full-large">
          <ServerTasks
            server={server}
            rules={rules}
            tasks={tasks}
            loadTasks={this.props.loadTasks}
          />
          <ServerRules
            history={this.props.history}
            server={server}
            rules={rules}
            tasks={tasks}
          />
        </div>
      </RightPanel>
    );
  }
}

export const RuleList = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      rules: state.capture.servers
        ? state.capture.servers[ownProps.match.params.serverID].rules
        : [],
      tasks: state.capture.servers
        ? state.capture.servers[ownProps.match.params.serverID].tasks
        : []
    };
  },
  {loadRules, loadTasks}
)(_RuleList);
