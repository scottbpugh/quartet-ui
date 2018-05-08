// Copyright (c) 2018 SerialLab
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
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {loadRules, loadTasks} from "../reducers/capture";
import {Card, Tag, Intent} from "@blueprintjs/core";

import {FormattedMessage} from "react-intl";
import {pluginRegistry} from "plugins/pluginRegistration";
import "./RuleList.css";
import {ServerTasks} from "./ServerTasks";

class _TasksList extends Component {
  render() {
    let {server, rules, tasks, loadTasks, count, next} = this.props;
    return (
      <RightPanel
        title={
          <FormattedMessage id="plugins.capture.tasks" defaultMessage="Tasks" />
        }>
        <div className="large-cards-container full-large">
          <ServerTasks
            server={server}
            rules={rules}
            tasks={tasks}
            loadTasks={loadTasks}
            count={count}
            next={next}
          />
        </div>
      </RightPanel>
    );
  }
}

export const TasksList = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      rules: state.capture.servers
        ? state.capture.servers[ownProps.match.params.serverID].rules
        : [],
      tasks: state.capture.servers
        ? state.capture.servers[ownProps.match.params.serverID].tasks
        : [],
      count: state.capture.servers
        ? state.capture.servers[ownProps.match.params.serverID].count
        : 0,
      next: state.capture.servers
        ? state.capture.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadRules, loadTasks}
)(_TasksList);
