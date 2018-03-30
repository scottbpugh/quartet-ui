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
import {
  Card,
  Tag,
  Intent,
  ControlGroup,
  Button,
  InputGroup,
  MenuDivider
} from "@blueprintjs/core";
import {Link} from "react-router-dom";
import {
  FormattedMessage,
  FormattedDate,
  FormattedTime,
  FormattedNumber
} from "react-intl";
import {pluginRegistry} from "plugins/pluginRegistration";
import "./RuleList.css";

/* Built a custom pagination for this, since the values are auto-updated every 5 seconds.
   I wanted total control of what happens when tasks are added/removed. */
export class ServerTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      keywordSearch: "",
      tasks: [],
      tasksPerPage: 5,
      inputSize: 50
    };
    this.offset = 0;
    this.currentPage = 0;
    this.debounced = null;
    this.maxPages = 0;
  }
  // filter by a field in the rows.
  filterBy = evt => {
    this.setState({filter: evt.currentTarget.value}, () => {
      this.offset = 0;
      this.currentPage = 0;
      this.processTasks(this.props.tasks);
    });
  };
  // search by a field in the rows or all of them.
  searchBy = evt => {
    this.setState({keywordSearch: evt.currentTarget.value}, () => {
      this.offset = 0;
      this.currentPage = 0;
      this.processTasks(this.props.tasks);
    });
  };
  componentDidMount() {
    this.processTasks(this.props.tasks || []);
  }
  // refresh the lists, keeping the search filters.
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.tasks) !== JSON.stringify(this.props.tasks)) {
      this.processTasks(nextProps.tasks);
    }
  }

  // go to next page if possible.
  next = () => {
    if (this.currentPage + 1 < this.maxPages) {
      this.currentPage += 1;
      this.offset = this.state.tasksPerPage * this.currentPage;
      this.processTasks(this.props.tasks, true);
    }
  };

  // go to previous page if possible.
  previous = () => {
    if (this.currentPage - 1 >= 0) {
      this.currentPage -= 1;
      this.offset = this.state.tasksPerPage * this.currentPage;
      this.processTasks(this.props.tasks, true);
    }
  };
  processTasks = (tasks, clear = false) => {
    if (this.debounced) {
      clearTimeout(this.debounced);
    }
    this.debounced = setTimeout(() => {
      const {rules} = this.props;
      const searchExp = new RegExp(this.state.keywordSearch, "i");
      const tasksSubset = tasks.filter(task => {
        // add rule object.
        task.ruleObject = rules.find(rule => {
          return Number(rule.id) === Number(task.rule);
        });
        if (this.state.filter && this.state.keywordSearch) {
          if (this.state.filter === "ruleName") {
            return task.ruleObject.name.match(searchExp);
          }
          return task[this.state.filter].match(searchExp);
        } else if (this.state.filter === "" && this.state.keywordSearch) {
          // search across all fields
          return JSON.stringify(task).match(searchExp);
        }
        return true;
      });
      this.maxPages = Math.ceil(tasksSubset.length / this.state.tasksPerPage);
      this.subsetTotal = tasksSubset.length;
      this.setState(
        {
          tasks: tasksSubset.slice(
            this.offset,
            this.offset + this.state.tasksPerPage
          )
        },
        () => {
          this.debounced = null;
        }
      );
    }, clear ? 0 : 250);
  };
  setTasksPerPage = evt => {
    this.currentPage = 0;
    this.offset = 0;
    let newTasksPerPage = Number(evt.currentTarget.value) | "";
    this.setState(
      {
        tasksPerPage: newTasksPerPage,
        inputSize: 10 * evt.currentTarget.value.length + 40
      },
      () => {
        this.processTasks(this.props.tasks);
      }
    );
  };
  render() {
    let serverName = this.props.server.serverSettingName;
    let serverID = this.props.server.serverID;
    const {rules} = this.props;
    const {tasks} = this.state;
    return (
      <Card className="pt-elevation-4">
        <h5>{serverName} Tasks</h5>
        <div />
        <div>
          <div className="table-control">
            <div className="pagination-control">
              <div>
                <Button
                  disabled={this.currentPage - 1 < 0}
                  onClick={this.previous.bind(this)}>
                  previous
                </Button>{" "}
                |{" "}
                <Button
                  disabled={this.currentPage + 1 >= this.maxPages}
                  onClick={this.next.bind(this)}>
                  next
                </Button>
              </div>
              <div>
                <input
                  className="pt-input"
                  placeholder="tasks"
                  name="taskPerPage"
                  dir="auto"
                  style={{width: this.state.inputSize, "text-align": "center"}}
                  value={this.state.tasksPerPage}
                  onChange={this.setTasksPerPage}
                />{" "}
                tasks per page. {this.subsetTotal}/{this.props.tasks.length}
                tasks. {this.currentPage}/{this.maxPages} pages.
              </div>
            </div>
            <ControlGroup fill={false} vertical={false}>
              <div class="pt-select">
                <select value={this.state.filter} onChange={this.filterBy}>
                  <option value="" selected>
                    Search
                  </option>
                  <option value="ruleName">Rule</option>
                  <option value="name">Task Name</option>
                  <option value="status">Status</option>
                </select>
              </div>
              <InputGroup
                onChange={this.searchBy}
                value={this.state.keywordSearch}
                placeholder="Enter Keywords..."
              />
            </ControlGroup>
          </div>
          <table className="pool-list-table pt-table pt-bordered pt-striped pt-interactive">
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
                      <tr>
                        <td>{task.ruleObject ? task.ruleObject.name : null}</td>
                        <td>{task.name}</td>
                        <td>
                          <FormattedDate value={task.status_changed} /> -{" "}
                          <FormattedTime value={task.status_changed} />
                        </td>
                        <td style={{"text-align": "center"}}>
                          <Tag intent={intent}>{task.status}</Tag>
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
