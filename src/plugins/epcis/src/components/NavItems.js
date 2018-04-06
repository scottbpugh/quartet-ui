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
import {pluginRegistry} from "plugins/pluginRegistration";
import {Menu, MenuDivider, MenuItem} from "@blueprintjs/core";

class SubNode extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }
  goTo = path => {
    this.props.history.push(path);
  };
  renderContextMenu = () => {
    const {server, serverID} = this.props;
    return (
      <Menu>
        <MenuDivider title="{server.serverSettingName}" />
        <MenuDivider />
        <MenuItem
          text="Add Event"
          onClick={this.goTo.bind(this, `/epcis/add-event/${serverID}`)}
        />
      </Menu>
    );
  };
  render() {
    return (
      <TreeNode
        depth={this.props.depth}
        path={`/`}
        onContextMenu={this.renderContextMenu.bind(this)}
        childrenNodes={this.props.childrenNodes}>
        {this.props.children}
      </TreeNode>
    );
  }
}

class _NavPluginRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }
  static get PLUGIN_COMPONENT_NAME() {
    return "EPCISNavRoot";
  }
  goTo = path => {
    this.props.history.push(path);
  };
  render() {
    const {serverID} = this.props;
    let children = [
      <SubNode
        depth={this.props.depth}
        childrenNodes={[
          <SubNode
            history={this.props.history}
            depth={this.props.depth}
            serverID={serverID}
            childrenNodes={[]}>
            Aggregation Events
          </SubNode>,
          <SubNode
            history={this.props.history}
            depth={this.props.depth}
            serverID={serverID}
            childrenNodes={[]}>
            Object Events
          </SubNode>,
          <SubNode
            history={this.props.history}
            depth={this.props.depth}
            serverID={serverID}
            childrenNodes={[]}>
            Transaction Events
          </SubNode>,
          <SubNode
            history={this.props.history}
            epth={this.props.depth}
            serverID={serverID}
            childrenNodes={[]}>
            Transformation Events
          </SubNode>
        ]}>
        Events
      </SubNode>,
      <SubNode
        history={this.props.history}
        depth={this.props.depth}
        serverID={serverID}
        childrenNodes={[]}>
        Entries
      </SubNode>,
      <SubNode
        history={this.props.history}
        depth={this.props.depth}
        serverID={serverID}
        childrenNodes={[]}>
        Messages
      </SubNode>
    ];
    return (
      <TreeNode
        depth={this.props.depth}
        active={this.state.active}
        history={this.props.history}
        serverID={serverID}
        childrenNodes={children}>
        EPCIS
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
