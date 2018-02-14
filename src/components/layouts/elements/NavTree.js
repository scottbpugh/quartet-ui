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

class _NavTree extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

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
        <button className="pt-button pt-icon-add tree-add-button">
          {/*
              <FormattedMessage
                id="plugins.numberRange.addServer"
                defaultMessage="Add a New Server"
              />*/}
        </button>
        <Tree>{this.getTree()}</Tree>
      </div>
    );
  }
}

export const NavTree = connect((state, ownProps) => {
  return {servers: state.serversettings.servers};
}, {})(_NavTree);
