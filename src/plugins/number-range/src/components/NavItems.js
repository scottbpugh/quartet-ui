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
import {withRouter} from "react-router-dom";
import {Tree, Icon} from "@blueprintjs/core";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {TreeNode} from "components/layouts/elements/NavTree";
import {loadPools} from "../reducers/numberrange";

export const NavItems = (pools, serverID) => {
  if (!Array.isArray(pools)) {
    return [];
  }
  return pools.map(pool => {
    return (
      <TreeNode
        key={pool.machine_name}
        path={`/number-range/region-detail/${serverID}/${pool.machine_name}`}
        nodeType="pool"
        childrenNodes={[]}>
        {pool.readable_name}
      </TreeNode>
    );
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
  render() {
    let {serverID} = this.props;
    let pools = this.props.nr[serverID] ? this.props.nr[serverID].pools : [];
    let children = NavItems(pools, serverID);
    return (
      <TreeNode
        nodeType="plugin"
        childrenNodes={children}
        path={`/number-range/pools/${serverID}`}>
        Serial Number Pools
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
