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
import {
  Menu,
  MenuItem,
  MenuDivider,
  Tree,
  Icon,
  Dialog
} from "@blueprintjs/core";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {TreeNode} from "components/layouts/elements/NavTree";
import {loadPools, setAllocation} from "../reducers/numberrange";
import {FormattedMessage} from "react-intl";

class _PoolItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAllocationOpen: false,
      alloc: 0,
      active: false
    };
  }
  goTo = path => {
    this.props.history.push(path);
  };
  toggleAllocation = () => {
    const {pool, serverID} = this.props;
    // redirect to pool regions if not already there.
    this.goTo(`/number-range/region-detail/${serverID}/${pool.machine_name}`);
    this.setState({isAllocationOpen: !this.state.isAllocationOpen});
  };
  renderContextMenu() {
    const {serverID, pool} = this.props;

    return (
      <Menu>
        <MenuDivider title={pool.readable_name} />
        <MenuDivider />
        <MenuItem
          onClick={this.goTo.bind(
            this,
            `/number-range/add-region/${serverID}/${pool.machine_name}`
          )}
          text={`${this.props.intl.formatMessage({
            id: "plugins.numberRange.addRegion"
          })}`}
        />
        <MenuItem
          onClick={this.toggleAllocation}
          text={this.props.intl.formatMessage({
            id: "plugins.numberRange.allocateButton"
          })}
        />
      </Menu>
    );
  }
  setAllocation = evt => {
    evt.preventDefault();
    const {pool, serverID} = this.props;
    this.props.setAllocation(
      this.props.servers[serverID],
      pool,
      this.state.alloc
    );
    this.toggleAllocation();
  };
  allocChange = evt => {
    this.setState({alloc: evt.target.value});
  };
  activateNode(currentPath) {
    // set active state if in current path.
    // for some reason this.props.location.pathname doesn't get updated.
    // window.location.pathname does.
    const {pool, serverID} = this.props;
    let regexp = new RegExp(`\/${serverID}\/${pool.machine_name}\/?$`);
    this.setState({active: regexp.test(currentPath)});
  }
  componentDidMount() {
    this.activateNode(this.props.currentPath);
  }
  componentWillReceiveProps(nextProps) {
    this.activateNode(nextProps.currentPath);
  }
  render() {
    const {pool, serverID, intl} = this.props;
    return (
      <TreeNode
        onContextMenu={this.renderContextMenu.bind(this)}
        key={pool.machine_name}
        path={`/number-range/region-detail/${serverID}/${pool.machine_name}`}
        nodeType="pool"
        active={this.state.active}
        collapsed={this.state.collapsed}
        depth={this.props.depth}
        childrenNodes={[]}>
        <Dialog
          isOpen={this.state.isAllocationOpen}
          onClose={this.toggleAllocation}
          title={`${this.props.intl.formatMessage({
            id: "plugins.numberRange.allocateButton"
          })} ${pool.readable_name}`}>
          <div className="pt-dialog-body">
            <form onSubmit={this.setAllocation} className="mini-form">
              <input
                placeholder="allocate"
                className="pt-input"
                type="number"
                defaultValue={1}
                value={this.state.alloc}
                onChange={this.allocChange}
                min={1}
                max={100000}
                style={{width: 200}}
              />
              <button type="submit" className="pt-button">
                <FormattedMessage id="plugins.numberRange.allocateButton" />
              </button>
            </form>
          </div>
        </Dialog>
        {pool.readable_name}
      </TreeNode>
    );
  }
}
const PoolItem = connect(
  state => {
    return {
      currentRegions: state.numberrange.currentRegions,
      servers: state.serversettings.servers,
      currentPath: state.layout.currentPath
    };
  },
  {setAllocation}
)(withRouter(_PoolItem));

export const NavItems = (pools, serverID, intl) => {
  if (!Array.isArray(pools)) {
    return [];
  }
  return pools.map(pool => {
    // passing intl down to use formatMessage and translate...
    return <PoolItem pool={pool} serverID={serverID} intl={intl} />;
  });
};

export class _NavPluginRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }
  static get PLUGIN_COMPONENT_NAME() {
    return "NumberRangeNavRoot";
  }
  goTo = path => {
    this.props.history.push(path);
  };
  componentDidMount() {
    if (
      Object.keys(this.props.servers).length > 0 &&
      this.props.serverID in this.props.servers
    ) {
      this.props.loadPools(this.props.servers[this.props.serverID]);
    }
    this.activateNode(this.props.currentPath);
  }
  componentWillReceiveProps(nextProps) {
    this.activateNode(nextProps.currentPath);
  }
  activateNode(currentPath) {
    // set active state if in current path.
    // for some reason this.props.location.pathname doesn't get updated.
    // window.location.pathname does.
    const {serverID} = this.props;
    let regexp = new RegExp(`\/${serverID}\/?`);
    this.setState({active: regexp.test(currentPath)});
  }
  renderContextMenu = () => {
    const {servers, serverID} = this.props;
    return (
      <Menu>
        <MenuDivider title={servers[serverID].serverSettingName} />
        <MenuDivider />
        <MenuItem
          onClick={this.goTo.bind(this, `/number-range/add-pool/${serverID}`)}
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
        depth={this.props.depth}
        childrenNodes={children}
        active={this.state.active}
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
      nr: state.numberrange.servers,
      currentPath: state.layout.currentPath
    };
  },
  {loadPools}
)(withRouter(_NavPluginRoot));
