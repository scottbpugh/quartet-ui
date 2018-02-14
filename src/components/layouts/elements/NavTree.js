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
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {NavItems} from "../../../plugins/number-range/src/components/NavItems";
import {ActionControls} from "./ActionControls";
import "./NavTree.css";
import classNames from "classnames";
import {Menu, MenuItem, Popover, Position, Button} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";

class TreeNode extends Component {
  render() {
    return (
      <li
        className={classNames({
          "pt-icon-chevron-right": true,
          arrow: true,
          "tree-node-server": true
        })}>
        <span className="tree-node-label">{this.props.children}</span>
        <ul>{this.props.childrenNodes}</ul>
      </li>
    );
  }
}

class Tree extends Component {
  render() {
    return <ul className="tree-root">{this.props.children}</ul>;
  }
}

class AddServerButton extends Component {
  goTo(path) {
    this.props.history.push(path);
  }
  render() {
    const addMenu = (
      <Menu className="menu-padding-fix">
        <MenuItem
          text={<FormattedMessage id="app.serverSettings.addAServer" />}
          onClick={this.goTo.bind(this, "/server-settings/")}
        />
      </Menu>
    );
    return (
      <div>
        <Popover content={addMenu} position={Position.RIGHT_CENTER}>
          <button
            onClick={this.displayMenu}
            tabindex="0"
            className="pt-button pt-icon-add">
            {/*
              <FormattedMessage
                id="plugins.numberRange.addServer"
                defaultMessage="Add a New Server"
              />*/}
          </button>
        </Popover>
      </div>
    );
  }
}

class _NavTree extends Component {
  constructor(props) {
    super(props);
  }

  getTree() {
    const {servers} = this.props;

    return Object.keys(servers).map(serverID => {
      return (
        <TreeNode key={serverID}>
          {servers[serverID].serverSettingName}
        </TreeNode>
      );
    });
  }
  render() {
    return (
      <div className="tree-wrapper">
        <div className="leftbar-group">
          <div className="pt-button-group pt-minimal">
            <AddServerButton history={this.props.history} />
            <Button tabindex="0" iconName="pt-icon-timeline-area-chart" />
            {/*
            <button
              className="pt-button pt-icon-control"
              tabindex="0"
              role="button"
            />
            <button
              className="pt-button pt-icon-graph"
              tabindex="0"
              role="button"
            />
            <button
              className="pt-button pt-icon-camera"
              tabindex="0"
              role="button"
            />
            <button
              className="pt-button pt-icon-map"
              tabindex="0"
              role="button"
            />*/}
          </div>
        </div>
        <div className="leftbar-group">
          <Tree>{this.getTree()}</Tree>
        </div>
      </div>
    );
  }
}

export const NavTree = connect((state, ownProps) => {
  return {servers: state.serversettings.servers};
}, {})(withRouter(_NavTree));
