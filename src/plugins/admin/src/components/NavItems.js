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
import {TreeNode} from "components/layouts/elements/NavTree";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

class _NavPluginRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }
  static get PLUGIN_COMPONENT_NAME() {
    return "AdminNavRoot";
  }
  goTo = path => {
    this.props.history.push(path);
  };
  render() {
    const {serverID} = this.props;
    return (
      <TreeNode
        depth={this.props.depth}
        active={this.state.active}
        path={`/admin/${serverID}`}
        childrenNodes={[]}>
        Admin
      </TreeNode>
    );
  }
}

export const NavPluginRoot = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.serverID],
    currentPath: state.layout.currentPath
  };
}, {})(withRouter(_NavPluginRoot));
