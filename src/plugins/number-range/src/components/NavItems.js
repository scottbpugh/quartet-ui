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
import {withRouter} from "react-router-dom";
import {Menu, MenuItem, MenuDivider, Tree, Icon} from "@blueprintjs/core";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {TreeNode} from "components/layouts/elements/NavTree";
import {loadPools} from "../reducers/numberrange";
import {FormattedMessage} from "react-intl";

class NavItem extends Component {
  renderContextMenu() {
    return (
      <Menu>
        <MenuDivider title={this.props.pool.readable_name} />
        <MenuDivider />
        <MenuItem
          text={this.props.intl.formatMessage({
            id: "plugins.numberRange.addRegion"
          })}
        />
        <MenuItem
          text={this.props.intl.formatMessage({
            id: "plugins.numberRange.allocateButton"
          })}
        />
      </Menu>
    );
  }
  render() {
    const {pool, serverID, intl} = this.props;
    return (
      <TreeNode
        onContextMenu={this.renderContextMenu.bind(this)}
        key={pool.machine_name}
        path={`/number-range/region-detail/${serverID}/${pool.machine_name}`}
        nodeType="pool"
        childrenNodes={[]}>
        {pool.readable_name}
      </TreeNode>
    );
  }
}

export const NavItems = (pools, serverID, intl) => {
  if (!Array.isArray(pools)) {
    return [];
  }
  return pools.map(pool => {
    // passing intl down to use formatMessage and translate...
    return <NavItem pool={pool} serverID={serverID} intl={intl} />;
  });
};

export class _NavPluginRoot extends Component {
  static get PLUGIN_COMPONENT_NAME() {
    return "NumberRangeNavRoot";
  }
  componentDidMount() {
    if (
      Object.keys(this.props.servers).length > 0 &&
      this.props.serverID in this.props.servers
    ) {
      this.props.loadPools(this.props.servers[this.props.serverID]);
    }
  }
  renderContextMenu = () => {
    const {servers, serverID} = this.props;
    return (
      <Menu>
        <MenuDivider title={servers[serverID].serverSettingName} />
        <MenuDivider />
        <MenuItem
          text={this.props.intl.formatMessage({
            id: "plugins.numberRange.addPool"
          })}
        />
      </Menu>
    );
  };
  render() {
    let {serverID} = this.props;
    let pools =
      this.props.nr && this.props.nr[serverID]
        ? this.props.nr[serverID].pools
        : [];
    let children = NavItems(pools, serverID, this.props.intl);
    return (
      <TreeNode
        onContextMenu={this.renderContextMenu}
        nodeType="plugin"
        childrenNodes={children}
        path={`/number-range/pools/${serverID}`}>
        <FormattedMessage id="plugins.numberRange.navItemsTitle" />
      </TreeNode>
    );
  }
}

export const NavPluginRoot = connect(
  (state, ownProps) => {
    return {
      servers: state.serversettings.servers,
      nr: state.numberrange.servers
    };
  },
  {loadPools}
)(_NavPluginRoot);
