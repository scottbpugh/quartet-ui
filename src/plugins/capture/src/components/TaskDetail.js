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
import {Card, Callout, Button, Tag, Intent} from "@blueprintjs/core";
import {connect} from "react-redux";
import {pluginRegistry} from "plugins/pluginRegistration";
import objectPath from "object-path";
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage, FormattedTime, FormattedDate} from "react-intl";
import "../styles.css";

const yieldDataPairRowIfSet = (key, value) => {
  if (key && value) {
    return (
      <tr>
        <td>
          {key}
        </td>
        <td>
          {value}
        </td>
      </tr>
    );
  }
  return null;
};

class _TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task:
        this.props.tasks.find(task => {
          return task.name === this.props.match.params.taskName;
        }) || null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      task:
        nextProps.tasks.find(task => {
          return task.name === nextProps.match.params.taskName;
        }) || null
    });
  }

  render() {
    const {task} = this.state;
    let intent = Intent.PRIMARY;
    switch (task.status) {
      case "FINISHED":
        intent = Intent.SUCCESS;
        break;
      case "WAITING":
        intent = Intent.WARNING;
        break;
      case "FAILED":
        intent = Intent.DANGER;
        break;
      case "RUNNING":
        intent = Intent.PRIMARY;
        break;
      default:
        intent = Intent.PRIMARY;
    }
    return (
      <RightPanel title={<FormattedMessage id="plugins.capture.taskDetail" />}>
        {task ? (
          <div className="cards-container">
            <Card className="pt-elevation-4">
              <h5>
                {task.name}
              </h5>
              <table className="pt-table data-pair-table pt-bordered pt-striped">
                <tbody>
                  {yieldDataPairRowIfSet("Name", task.name)}
                  <tr>
                    <td>
Status
                    </td>
                    <td>
                      <Tag intent={intent}>
                        {task.status}
                      </Tag>
                    </td>
                  </tr>
                  {yieldDataPairRowIfSet("Status Changed", task.status_changed)}
                </tbody>
              </table>
            </Card>
            {task.ruleObject ? (
              <Card className="pt-elevation-4">
                <h5>
Rule
                </h5>
                <table className="pt-table data-pair-table pt-bordered pt-striped">
                  <tbody>
                    {yieldDataPairRowIfSet("Rule Name", task.ruleObject.name)}
                    {yieldDataPairRowIfSet(
                      "Description",
                      task.ruleObject.description
                    )}
                  </tbody>
                </table>
              </Card>
            ) : (
              <Card className="pt-elevation-4" />
            )}
            <Card className="task-messages pt-elevation-4">
              <h5>
Messages
              </h5>
              {task.taskmessage_set.map((message, index) => {
                let intent = Intent.PRIMARY;
                let numberedClass = "default";
                switch (message.level) {
                  case "INFO":
                    intent = null;
                    numberedClass = "info";
                    break;
                  case "WARN":
                    intent = Intent.WARNING;
                    numberedClass = "warning";
                    break;
                  case "ERROR":
                    intent = Intent.DANGER;
                    numberedClass = "danger";
                    break;
                  default:
                    intent = Intent.PRIMARY;
                }
                return (
                  <div
                    key={`task-message-${message.id}`}
                    style={{position: "relative"}}
                    className="inset-card"
                  >
                    <div className="message-info">
                      <span className={`numbered-message ${numberedClass}`}>
                        #
                        {index + 1}
                      </span>
                      <table className="data-pair-table">
                        <tbody>
                          <tr>
                            <td>
Level
                            </td>
                            <td>
                              <Tag intent={intent}>
                                {message.level}
                              </Tag>
                            </td>
                          </tr>
                          {yieldDataPairRowIfSet("Created", message.created)}
                        </tbody>
                      </table>
                    </div>
                    <pre>
                      {message.message}
                    </pre>
                  </div>
                );
              })}
            </Card>
          </div>
        ) : null}
      </RightPanel>
    );
  }
}

export const TaskDetail = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID],
    tasks: objectPath.get(
      state,
      ["capture", "servers", ownProps.match.params.serverID, "tasks"],
      []
    )
  };
})(_TaskDetail);
