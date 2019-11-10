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
import {
  Card,
  Tag,
  ControlGroup,
  Button,
  InputGroup,
  Intent
} from "@blueprintjs/core";
import {FormattedMessage, FormattedDate, FormattedTime} from "react-intl";
import {withRouter} from "react-router";

class _ServerTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      keywordSearch: "",
      tasks: [],
      tasksPerPage: 20,
      inputSize: 50,
      maxPages: 1
    };
    this.offset = 0;
    this.currentPage = 1;
    this.debounced = null;
    this.taskType = null;
    this.fetchTasks = null;
  }

  updateSearch = evt => {
    this.setState({keywordSearch: evt.currentTarget.value});
  };

  handleEnterKeySearch = evt => {
    if (evt.key === "Enter") {
      this.searchBy(evt);
    }
  };

  // search by a field in the rows or all of them.
  searchBy = evt => {
     this.offset = 0;
     this.currentPage = 1;
     this.processTasks();
  };

  componentDidMount() {
    if (this.props.match.params.taskType) {
      this.taskType = this.props.match.params.taskType;
    }
    this.processTasks();
    this.fetchTasks = setInterval(() => {
      this.processTasks();
    }, 20000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchTasks);
    this.fetchTasks = null;
  }

  // refresh the Lists, keeping the search filters.
  componentWillReceiveProps(nextProps) {
    const {rules} = this.props;
    let maxPages = this.currentPage;
    if (nextProps.next !== null && Array.isArray(nextProps.tasks)) {
      maxPages = Math.ceil(nextProps.count / nextProps.tasks.length);
    }
    let tasks = [];
    if (nextProps.tasks && nextProps.tasks.length > 0) {
      // only map task to rule name if task is an int.
      if (typeof nextProps.tasks[0].rule === 'number') {
        tasks = nextProps.tasks.map(task => {
          task.ruleObject = rules.find(rule => {
            return Number(rule.id) === Number(task.rule);
          });
          return task;
        });
      } else {
        // Rule already mapped from API. Do nothing.
        tasks = nextProps.tasks;
      }
    }
    this.setState({
      tasks: tasks,
      maxPages: maxPages
    });
  }

  goTo = path => {
    this.props.history.push(path);
  };

  // go to next page if possible.
  next = () => {
    this.currentPage += 1;
    this.processTasks(true);
  };

  // go to previous page if possible.
  previous = () => {
    this.currentPage -= 1;
    this.offset = this.state.tasksPerPage * this.currentPage;
    this.processTasks(true);
  };

  processTasks = (clear = false) => {
    if (this.debounced) {
      clearTimeout(this.debounced);
    }
    this.debounced = setTimeout(() => {
      const {server} = this.props;
      this.props.loadTasks(
        server,
        this.state.keywordSearch,
        this.currentPage,
        "-status_changed"
      );
    }, clear ? 0 : 250);
  };

  render() {
    let serverName = this.props.server.serverSettingName;
    const {tasks} = this.state;
    return (
      <Card className="bp3-elevation-4">
        <h5>
          {" "}
          <div className="right-aligned-elem">
            <Tag className="bp3-large">
              {this.currentPage}/{this.state.maxPages}
            </Tag>
          </div>
          {serverName} Tasks
        </h5>
        <div>
          <div className="table-control">
            <div className="pagination-control">
              <div>
                <Button
                  disabled={this.currentPage - 1 < 1}
                  onClick={this.previous.bind(this)}>
                  previous
                </Button>{" "}
                |{" "}
                <Button
                  disabled={this.currentPage >= this.state.maxPages}
                  onClick={this.next.bind(this)}>
                  next
                </Button>
              </div>
            </div>
            <div>
              <ControlGroup fill={false} vertical={false}>
                <Button intent={Intent.PRIMARY} onClick={this.searchBy}>Search</Button>
                <InputGroup
                  onChange={this.updateSearch}
                  onKeyPress={this.handleEnterKeySearch}
                  value={this.state.keywordSearch}
                  placeholder="Enter Keywords..."
                />
              </ControlGroup>
              <div className="label-info-display">
                <FormattedMessage
                  id="plugins.capture.tasksTotal"
                  values={{tasksCount: this.props.count}}
                />
              </div>
            </div>
          </div>
          <div className="overflowed-table">
            <table className="pool-list-table bp3-table bp3-bordered bp3-striped bp3-interactive">
              <thead>
                <tr>
                  <th>
                    <FormattedMessage
                      id="plugins.capture.ruleName"
                      defaultMessage="Rule Name"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="plugins.capture.name"
                      defaultMessage="Task Name"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="plugins.capture.taskStatusChanged"
                      defaultMessage="Status Changed"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="plugins.capture.taskStatus"
                      defaultMessage="Status"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(tasks) && tasks.length > 0
                  ? tasks.map(task => {
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
                        <tr
                          onClick={this.goTo.bind(
                            this,
                            `/capture/tasks/${
                              this.props.server.serverID
                            }/detail/${task.name}`
                          )}
                          key={task.name}>
                          <td>
                            {typeof task.rule === 'object' ? task.rule.name : null}
                            {task.ruleObject ? task.ruleObject.name : null}
                          </td>
                          <td>{task.name}</td>
                          <td>
                            <FormattedDate value={task.status_changed} /> -{" "}
                            <FormattedTime value={task.status_changed} />
                          </td>
                          <td style={{textAlign: "center"}}>
                            <Tag intent={intent}>{task.status}</Tag>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    );
  }
}

export const ServerTasks = withRouter(_ServerTasks);
