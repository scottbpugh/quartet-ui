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
import {Card, Callout, Button, Tag, Intent, Icon} from "@blueprintjs/core";
import {connect} from "react-redux";
import {pluginRegistry} from "plugins/pluginRegistration";
import objectPath from "object-path";
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage, FormattedTime, FormattedDate} from "react-intl";
import {ConfirmDialog} from "components/elements/ConfirmDialog";
import {showMessage} from "lib/message";
import "../styles.css";

const yieldDataPairRowIfSet = (key, value) => {
  if (key && value) {
    return (
      <tr>
        <td>{key}</td>
        <td>{value}</td>
      </tr>
    );
  }
  return null;
};

class _TaskDetail extends Component {
  constructor(props) {
    super(props);
    let task =
      this.props.tasks.find(task => {
        return task.name === this.props.match.params.taskName;
      }) || null;
    if (typeof task.rule === 'object') {
      // backward compatible.
      task.ruleObject = task.rule;
    }
    this.state = {
      task: task,
      confirmOpened: false,
      downloadLink: ""
    };
    this.autoRefresh = null;
  }
  setDownloadLink = async () => {
    let serverObject = await pluginRegistry.getServer(this.props.server);
    let client = await serverObject.getClient();
    try {
      if (typeof client.apis.capture.capture_task_data_read === "function") {
        this.setState({
          downloadLink: `${serverObject.url}capture/task-data/${
            this.state.task.name
          }/`
        });
      }
    } catch (e) {
      // just leave the downloadLink empty if any ancestor of capture_task_data_read is undefined.
    }
  };
  componentDidMount() {
    if (this.state.task && this.state.task.status !== "FINISHED") {
      this.autoRefresh = window.setInterval(() => {
        this.refetchTask();
      }, 10000);
    }
    this.setDownloadLink();
  }
  componentWillUnmount() {
    if (this.autoRefresh) {
      clearInterval(this.autoRefresh);
    }
  }
  toggleConfirmRestart = () => {
    this.setState({confirmOpened: !this.state.confirmOpened});
  };
  refetchTask = () => {
    let serverObject = pluginRegistry.getServer(this.props.server);
    serverObject
      .fetchObject("capture_tasks_read", {name: this.state.task.name})
      .then(response => {
        if (
          this.state.task.ruleObject &&
          typeof this.state.task.ruleObject === "object"
        ) {
          // add rule detail from list.
          response.ruleObject = this.state.task.ruleObject;
        } else if (
          typeof this.state.task.rule === 'object'
        ) {
          response.ruleObject = this.state.task.rule;
        } else {
          let task =
            this.props.tasks.find(task => {
              return task.name === this.props.match.params.taskName;
            }) || null;
          if (task) {
            response.ruleObject = task.ruleObject;
          }
        }
        this.setState({task: response});
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.capture.executeTaskError",
          values: {error: e}
        });
      });
  };
  restartTask = () => {
    this.toggleConfirmRestart();
    let serverObject = pluginRegistry.getServer(this.props.server);
    serverObject
      .fetchObject("capture_execute_read", {
        task_name: this.state.task.name
      })
      .then(response => {
        showMessage({type: "success", msg: response});
        if (this.autoRefresh) {
          clearInterval(this.autoRefresh);
        }
        this.autoRefresh = window.setInterval(() => {
          this.refetchTask();
        }, 5000);
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.capture.executeTaskError",
          values: {error: e}
        });
      });
  };
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
    let linkColor = this.props.theme.startsWith("dark") ? "#CCC" : "#555";
    return (
      <RightPanel title={<FormattedMessage id="plugins.capture.taskDetail" />}>
        {task ? (
          <div className="cards-container">
            <Card className="bp3-elevation-4">
              <h5 className="bp3-heading">
                {task.name}
                {this.state.downloadLink ? (
                  <a
                    style={{color: linkColor, paddingLeft: "10px"}}
                    href={this.state.downloadLink}
                    target="_blank">
                    <Icon
                      disabled={this.state.downloadLink ? false : true}
                      iconName="bp3-icon-cloud-download"
                    />
                  </a>
                ) : null}
                <button
                  onClick={this.toggleConfirmRestart}
                  className="bp3-button right-aligned-elem bp3-interactive bp3-intent-primary">
                  <FormattedMessage id="plugins.capture.restart" />
                </button>
              </h5>
              <ConfirmDialog
                isOpen={this.state.confirmOpened}
                title={<FormattedMessage id="plugins.capture.confirmRestart" />}
                body={
                  <FormattedMessage id="plugins.capture.confirmRestartBody" />
                }
                toggle={this.toggleConfirmRestart.bind(this)}
                confirmAction={this.restartTask.bind(this)}
              />
              <table className="bp3-table data-pair-table bp3-bordered bp3-striped">
                <tbody>
                  {yieldDataPairRowIfSet("Name", task.name)}
                  <tr>
                    <td>Status</td>
                    <td>
                      <Tag intent={intent}>{task.status}</Tag>
                    </td>
                  </tr>
                  {yieldDataPairRowIfSet("Status Changed", task.status_changed)}
                </tbody>
              </table>
            </Card>
            {task.ruleObject ? (
              <Card className="bp3-elevation-4">
                <h5 className="bp3-heading">Rule</h5>
                <table className="bp3-table data-pair-table bp3-bordered bp3-striped">
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
              <Card className="bp3-elevation-4" />
            )}
            {task.taskhistory_set &&
            Array.isArray(task.taskhistory_set) &&
            task.taskhistory_set.length > 0 ? (
              <Card className="bp3-elevation-4">
                <h5 className="bp3-heading">Task History</h5>

                <div>
                  <table className="bp3-table bp3-bordered bp3-striped">
                    <thead>
                      <tr>
                        <td>Created</td>
                        <td>Modified</td>
                        <td>Username</td>
                        <td>Email</td>
                      </tr>
                    </thead>
                    <tbody>
                      {" "}
                      {task.taskhistory_set.map(history => {
                        return (
                          <tr>
                            <th>{history.created}</th>
                            <th>{history.modified}</th>
                            <th>{history.user.username}</th>
                            <th>{history.user.email}</th>
                          </tr>
                        );
                      })}{" "}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : null}
            <Card className="task-messages bp3-elevation-4">
              <h5 className="bp3-heading">Messages</h5>
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
                    className="inset-card">
                    <div className="message-info">
                      <span className={`numbered-message ${numberedClass}`}>
                        #
                        {index + 1}
                      </span>
                      <table className="data-pair-table">
                        <tbody>
                          <tr>
                            <td>Level</td>
                            <td>
                              <Tag intent={intent}>{message.level}</Tag>
                            </td>
                          </tr>
                          {yieldDataPairRowIfSet("Created", message.created)}
                        </tbody>
                      </table>
                    </div>
                    <pre>{message.message}</pre>
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
    ),
    theme: state.layout.theme
  };
}, {})(_TaskDetail);
