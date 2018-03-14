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
  Dialog,
  Button,
  ButtonGroup,
  ContextMenu
} from "@blueprintjs/core";
import {connect} from "react-redux";
import {TreeNode} from "components/layouts/elements/NavTree";
import {loadPools, setAllocation, deleteAPool} from "../reducers/numberrange";
import {FormattedMessage} from "react-intl";
import classNames from "classnames";
import {pluginRegistry} from "plugins/pluginRegistration";
import {DeleteDialog} from "components/elements/DeleteDialog";

class _PoolItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAllocationOpen: false,
      alloc: 0,
      active: false,
      isConfirmDeleteOpen: false
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
  getAllowedRegionTypes = () => {
    const {pool} = this.props;
    if (pool.sequentialregion_set.length > 0) {
      return {sequential: true, randomized: false};
    }
    if (pool.randomizedregion_set.length > 0) {
      return {sequential: false, randomized: true};
    }
    if (
      pool.sequentialregion_set.length === 0 &&
      pool.randomizedregion_set.length === 0
    ) {
      return {sequential: true, randomized: true};
    }
  };
  renderContextMenu() {
    const {serverID, pool} = this.props;
    const {sequential, randomized} = this.getAllowedRegionTypes();
    return (
      <Menu>
        <ButtonGroup className="context-menu-control" minimal={true}>
          <Button small={true} iconName="edit" />
          <Button
            small={true}
            onClick={this.toggleConfirmDelete}
            iconName="trash"
          />
        </ButtonGroup>
        <MenuDivider title={pool.readable_name} />
        <MenuDivider />
        {sequential ? (
          <MenuItem
            onClick={this.goTo.bind(
              this,
              `/number-range/add-region/${serverID}/${pool.machine_name}`
            )}
            text={`${this.props.intl.formatMessage({
              id: "plugins.numberRange.addSequentialRegion"
            })}`}
          />
        ) : null}
        {randomized ? (
          <MenuItem
            onClick={this.goTo.bind(
              this,
              `/number-range/add-randomized-region/${serverID}/${
                pool.machine_name
              }`
            )}
            text={`${this.props.intl.formatMessage({
              id: "plugins.numberRange.addRandomizedRegion"
            })}`}
          />
        ) : null}
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
      pluginRegistry.getServer(serverID),
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
    // using full current path as a shortcut to match anything.
    const {pool, serverID} = this.props;
    let regexp = new RegExp(`/${serverID}/${pool.machine_name}/?$`);
    this.setState({active: regexp.test(currentPath)});
  }
  componentDidMount() {
    this.activateNode(this.props.currentPath);
  }
  componentWillReceiveProps(nextProps) {
    this.activateNode(nextProps.currentPath);
  }
  toggleConfirmDelete = evt => {
    this.setState({isConfirmDeleteOpen: !this.state.isConfirmDeleteOpen});
  };
  trashRegion = evt => {
    const {serverID, pool, deleteAPool} = this.props;
    const serverObject = pluginRegistry.getServer(serverID);
    this.toggleConfirmDelete();
    ContextMenu.hide();
    deleteAPool(serverObject, pool);
    this.props.history.push(`/number-range/pools/${serverObject.serverID}`);
  };
  render() {
    const {pool, serverID} = this.props;
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
          })} ${pool.readable_name}`}
          className={classNames({
            "pt-dark": this.props.theme.startsWith("dark") ? true : false
          })}>
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
        <DeleteDialog
          isOpen={this.state.isConfirmDeleteOpen}
          title={
            <FormattedMessage
              id="plugins.numberRange.deleteRegion"
              values={{regionName: pool.readable_name}}
            />
          }
          body={
            <FormattedMessage id="plugins.numberRange.deleteRegionConfirm" />
          }
          toggle={this.toggleConfirmDelete.bind(this)}
          deleteAction={this.trashRegion.bind(this)}
        />
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
      currentPath: state.layout.currentPath,
      theme: state.layout.theme
    };
  },
  {setAllocation, deleteAPool}
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
  serverHasSerialbox() {
    return pluginRegistry
      .getServer(this.props.serverID)
      .appList.includes("serialbox");
  }
  goTo = path => {
    this.props.history.push(path);
  };
  componentDidMount() {
    if (this.props.server && this.serverHasSerialbox()) {
      this.props.loadPools(pluginRegistry.getServer(this.props.serverID));
    }
    // turning off active for root plugin item because it looks like too much green.
    //this.activateNode(this.props.currentPath);
  }
  componentWillReceiveProps(nextProps) {
    // turning off active for root plugin item because it looks like too much green.
    //this.activateNode(nextProps.currentPath);
  }
  activateNode(currentPath) {
    // set active state if in current path.
    // for some reason this.props.location.pathname doesn't get updated.
    // window.location.pathname does.
    const {serverID} = this.props;
    let regexp = new RegExp(`/${serverID}/?`);
    this.setState({active: regexp.test(currentPath)});
  }
  renderContextMenu = () => {
    const {server, serverID} = this.props;
    return (
      <Menu>
        <MenuDivider title={server.serverSettingName} />
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
    let {serverID, pools} = this.props;
    if (this.props.server && this.serverHasSerialbox()) {
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
    } else {
      return <div />;
    }
  }
}

export const NavPluginRoot = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.serverID],
      pools:
        state.numberrange.servers &&
        state.numberrange.servers[ownProps.serverID]
          ? state.numberrange.servers[ownProps.serverID].pools
          : [],
      currentPath: state.layout.currentPath
    };
  },
  {loadPools}
)(withRouter(_NavPluginRoot));
