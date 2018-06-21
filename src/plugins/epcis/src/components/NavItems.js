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
import {TreeNode} from "components/layouts/elements/TreeNode";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {pluginRegistry} from "plugins/pluginRegistration";
import {Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";

class SubNode extends Component {
  goTo = path => {
    this.props.history.push(path);
  };
  renderContextMenu = () => {
    const {server, menuItems} = this.props;
    return (
      <Menu>
        <MenuDivider title={`${server.serverSettingName}`} />
        <MenuDivider />
        {menuItems || null}
      </Menu>
    );
  };
  render() {
    return (
      <TreeNode
        depth={this.props.depth}
        path={this.props.path ? this.props.path : null}
        onContextMenu={this.renderContextMenu.bind(this)}
        childrenNodes={this.props.childrenNodes}>
        {this.props.children}
      </TreeNode>
    );
  }
}

class _NavPluginRoot extends Component {
  serverHasEPCIS() {
    return pluginRegistry
      .getServer(this.props.serverID)
      .appList.includes("epcis");
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  static get PLUGIN_COMPONENT_NAME() {
    return "EPCISNavRoot";
  }
  goTo = path => {
    this.props.history.push(path);
  };

  renderContextMenu = () => {
    const {server, serverID} = this.props;
    return (
      <Menu>
        <MenuDivider title={`${server.serverSettingName}`} />
        <MenuDivider />
        <MenuItem
          text={pluginRegistry
            .getIntl()
            .formatMessage({id: "plugins.epcis.addEvent"})}
          onClick={this.goTo.bind(this, `/epcis/add-event/${serverID}`)}
        />
        <MenuItem
          text="Add Entry"
          onClick={this.goTo.bind(this, `/epcis/add-entry/${serverID}`)}
        />
      </Menu>
    );
  };
  render() {
    const {serverID, server, currentPath} = this.props;
    let eventMenuItem = (
      <MenuItem
        text={pluginRegistry
          .getIntl()
          .formatMessage({id: "plugins.epcis.addEvent"})}
        onClick={this.goTo.bind(this, `/epcis/add-event/${serverID}`)}
      />
    );
    let entryMenuItem = (
      <MenuItem
        text={pluginRegistry
          .getIntl()
          .formatMessage({id: "plugins.epcis.addEntry"})}
        onClick={this.goTo.bind(this, `/epcis/add-entry/${serverID}`)}
      />
    );

    let children = [
      <SubNode
        depth={this.props.depth}
        key="main"
        server={server}
        menuItems={eventMenuItem}
        path={`/epcis/event-list/${serverID}`}
        currentPath={currentPath}
        childrenNodes={[
          <SubNode
            depth={this.props.depth}
            serverID={serverID}
            server={server}
            key="aggreg"
            menuItems={eventMenuItem}
            currentPath={currentPath}
            path={`/epcis/event-list/${serverID}/type/ag`}
            childrenNodes={[]}>
            <FormattedMessage id="plugins.epcis.aggregationEvents" />
          </SubNode>,
          <SubNode
            depth={this.props.depth}
            serverID={serverID}
            server={server}
            menuItems={eventMenuItem}
            currentPath={currentPath}
            key="obj"
            path={`/epcis/event-list/${serverID}/type/ob`}
            childrenNodes={[]}>
            <FormattedMessage id="plugins.epcis.objectEvents" />
          </SubNode>,
          <SubNode
            depth={this.props.depth}
            serverID={serverID}
            server={server}
            menuItems={eventMenuItem}
            currentPath={currentPath}
            key="tx"
            path={`/epcis/event-list/${serverID}/type/tx`}
            childrenNodes={[]}>
            <FormattedMessage id="plugins.epcis.transactionEvents" />
          </SubNode>,
          <SubNode
            depth={this.props.depth}
            serverID={serverID}
            server={server}
            menuItems={eventMenuItem}
            currentPath={currentPath}
            path={`/epcis/event-list/${serverID}/type/tf`}
            key="tf"
            childrenNodes={[]}>
            <FormattedMessage id="plugins.epcis.transformationEvents" />
          </SubNode>
        ]}>
        <FormattedMessage id="plugins.epcis.events" />
      </SubNode>,
      <SubNode
        depth={this.props.depth}
        serverID={serverID}
        server={server}
        currentPath={currentPath}
        menuItems={entryMenuItem}
        path={`/epcis/entry-list/${serverID}`}
        key="entries"
        childrenNodes={[]}>
        <FormattedMessage id="plugins.epcis.entries" />
      </SubNode>
    ];
    if (this.serverHasEPCIS()) {
      return (
        <TreeNode
          onContextMenu={this.renderContextMenu}
          depth={this.props.depth}
          serverID={serverID}
          server={server}
          childrenNodes={children}>
          <FormattedMessage id="plugins.epcis.topNavItem" />
        </TreeNode>
      );
    }
    return (
      <TreeNode depth={this.props.depth} childrenNodes={[]}>
        <i>
          <FormattedMessage id="plugins.epcis.noEPCISFound" />
        </i>
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
