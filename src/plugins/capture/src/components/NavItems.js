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
import {pluginRegistry} from "plugins/pluginRegistration";
import {TreeNode} from "components/layouts/elements/NavTree";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Menu, MenuItem, MenuDivider} from "@blueprintjs/core";
import {loadRules} from "../reducers/capture";
import {RuleItem} from "./RuleItem";

class _NavPluginRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }
  static get PLUGIN_COMPONENT_NAME() {
    return "CaptureNavRoot";
  }
  serverHasCapture() {
    return pluginRegistry
      .getServer(this.props.serverID)
      .appList.includes("capture");
  }
  goTo = path => {
    this.props.history.push(path);
  };
  activateNode(currentPath) {
    const {serverID} = this.props;
    let regexp = new RegExp(`capture/.*/${serverID}`);
    this.setState({active: regexp.test(currentPath)});
  }
  componentDidMount() {
    if (this.props.server && this.serverHasCapture()) {
      this.props.loadRules(pluginRegistry.getServer(this.props.serverID));
      this.activateNode(this.props.currentPath);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.activateNode(nextProps.currentPath);
  }
  renderContextMenu = () => {
    const {server, serverID} = this.props;
    return (
      <Menu>
        <MenuDivider title={server.serverSettingName} />
        <MenuDivider />
        <MenuItem
          onClick={this.goTo.bind(this, `/capture/add-rule/${serverID}/rule`)}
          text={this.props.intl.formatMessage({
            id: "plugins.capture.addRule"
          })}
        />
      </Menu>
    );
  };
  render() {
    const {serverID, currentPath} = this.props;
    if (this.serverHasCapture()) {
      const {rules} = this.props;
      let children = rules
        ? rules.map(rule => {
            return (
              <RuleItem
                currentPath={currentPath}
                rule={rule}
                serverID={this.props.server.serverID}
              />
            );
          })
        : [];
      return (
        <TreeNode
          depth={this.props.depth}
          active={this.state.active}
          onContextMenu={this.renderContextMenu}
          path={`/capture/rules/${serverID}`}
          childrenNodes={children}>
          <FormattedMessage id="plugins.capture.navItemsTitle" />
        </TreeNode>
      );
    }
    return (
      <TreeNode
        depth={this.props.depth}
        active={this.state.active}
        childrenNodes={[]}>
        <i>No Capture detected on server</i>
      </TreeNode>
    );
  }
}

export const NavPluginRoot = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.serverID],
      rules:
        state.capture.servers && state.capture.servers[ownProps.serverID]
          ? state.capture.servers[ownProps.serverID].rules
          : [],
      currentPath: state.layout.currentPath
    };
  },
  {loadRules}
)(withRouter(_NavPluginRoot));
