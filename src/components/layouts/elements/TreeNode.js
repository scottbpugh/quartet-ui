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
import classNames from "classnames";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {ContextMenuTarget, Icon} from "@blueprintjs/core";
import {SubTree} from "./NavTree";
import "./TreeNode.css";

class _TreeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childrenNodes: [],
      collapsed: true,
      persistent: false,
      active: false,
      highlightedNode: false
    };
  }
  toggleChildren = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    this.setState({collapsed: !this.state.collapsed});
  };
  componentDidMount() {
    this.activateNode(this.props.currentPath, this.props.path);
  }
  componentWillReceiveProps(nextProps) {
    this.activateNode(nextProps.currentPath, nextProps.path);
  }
  go = e => {
    e.stopPropagation(); // prevent parent go to be triggered.
    e.preventDefault();
    this.toggleChildren(e);
    if (this.props.onClick) {
      this.props.onClick(e);
    } else if (this.props.path) {
      this.props.history.push(this.props.path);
    }
  };
  activateNode(currentPath, path) {
    if (path) {
      let regexp = new RegExp("^" + path + "$");
      this.setState({active: regexp.test(currentPath)});
    }
  }
  /**
   * renderContextMenu - Use onContextMenu={} to display a menu.
   *
   * @return {type} Description
   */
  renderContextMenu(e) {
    if ("onContextMenu" in this.props) {
      e.preventDefault();
      return this.props.onContextMenu();
    }
  }
  render() {
    let expandable = this.props.childrenNodes.length > 0 ? true : false;
    let childrenNodes = this.props.childrenNodes.map(elem => {
      return React.cloneElement(elem, {depth: this.props.depth + 1});
    });
    let collapsed = this.state.collapsed; // for future use to have more logic.
    return (
      <li
        className={classNames("tree-node",{
          arrow: true,
          collapsed: collapsed
        })}
        onClick={this.go}>
        <div
          className={classNames({
            "tree-node-content": true,
            "tree-node-content-active": this.props.active || this.state.active,
            [`tree-node-depth-${this.props.depth}`]: true,
            "tree-node-content-highlighted": this.state.highlightedNode,
            "tree-node-parent-active":
              this.props.parentActive &&
              (!this.props.active && !this.state.active)
          })}>
          <a onClick={this.toggleChildren}>
            <span
              className={classNames({
                "arrow-straight": collapsed,
                "arrow-rotated": !collapsed
              })}>
              <Icon
                icon={this.props.icon}
                style={{visibility: expandable ? "visible" : "hidden"}}
              />
            </span>
          </a>
          <a
            className={classNames({
              [`tree-node-${this.props.nodeType}`]: true,
              "tree-node-link": true,
              "tree-node-active": this.props.active || this.state.active
            })}>
            <span className="tree-node-label">{this.props.children}</span>
          </a>
        </div>
        <SubTree collapsed={collapsed}>{childrenNodes}</SubTree>
      </li>
    );
  }
}

ContextMenuTarget(_TreeNode);

export const TreeNode = connect((state, ownProps) => {
  return {
    currentPath: state.layout.currentPath
  };
}, {})(withRouter(_TreeNode));

TreeNode.propTypes = {
  onContextMenu: PropTypes.func,
  depth: PropTypes.number.isRequired,
  active: PropTypes.bool,
  parentActive: PropTypes.bool,
  serverID: PropTypes.string,
  childrenNodes: PropTypes.arrayOf(PropTypes.element)
};
window.qu4rtet.exports("components/layouts/elements/TreeNode", this);

