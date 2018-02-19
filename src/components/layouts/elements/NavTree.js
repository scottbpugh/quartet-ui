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
import {ActionControls} from "./ActionControls";
import "./NavTree.css";
import classNames from "classnames";
import {
  Menu,
  MenuItem,
  Popover,
  Position,
  Button,
  Icon
} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {getRegisteredComponent} from "../../../plugins/pluginRegistration";

export class CustomIcon extends Component {
  render() {
    return <span className={classNames({"pt-icon-standard": true})} />;
  }
}

export const Fade = ({children, ...props}) => (
  <CSSTransition {...props} timeout={200} classNames="slide">
    {children}
  </CSSTransition>
);

class SubTree extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className="swing">
        <TransitionGroup>
          {!this.props.collapsed
            ? this.props.children.map((item, i) => {
                return <Fade key={i}>{item}</Fade>;
              })
            : null}
        </TransitionGroup>
      </ul>
    );
  }
}

class _TreeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {childrenNodes: [], collapsed: true};
  }
  toggleChildren = evt => {
    this.setState({collapsed: !this.state.collapsed}, () => {
      // go to path, for detail...
      this.go();
    });
  };
  go = () => {
    if (this.props.path) {
      this.props.history.push(this.props.path);
    }
  };
  render() {
    let expandable = this.props.childrenNodes.length > 0 ? true : false;
    return (
      <li
        className={classNames({
          arrow: true,
          [`tree-node-${this.props.nodeType}`]: true,
          collapsed: this.state.collapsed
        })}>
        <a onClick={this.toggleChildren}>
          <span
            className={classNames({
              "arrow-straight": this.state.collapsed,
              "arrow-rotated": !this.state.collapsed
            })}>
            <Icon
              iconName="pt-icon-chevron-right"
              style={{visibility: expandable ? "visible" : "hidden"}}
            />
          </span>
        </a>

        <a onClick={this.go}>
          <span className="tree-node-label">{this.props.children}</span>
        </a>
        <SubTree collapsed={this.state.collapsed}>
          {this.props.childrenNodes}
        </SubTree>
      </li>
    );
  }
}

export const TreeNode = withRouter(_TreeNode);

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
  componentDidMount() {
    this.tree = this.getTree();
  }
  componentWillReceiveProps(nextProps) {}
  getTree = () => {
    const {servers} = this.props;
    const props = this.props;
    return Object.keys(servers).map(serverID => {
      let children = Object.keys(props.navTreeItems).map(component => {
        let ComponentName = getRegisteredComponent(component);
        return <ComponentName serverID={serverID} />;
      });
      return (
        <TreeNode
          key={serverID}
          nodeType="server"
          childrenNodes={children ? children : []}>
          {servers[serverID].serverSettingName}
        </TreeNode>
      );
    });
  };
  render() {
    return (
      <div className="tree-wrapper">
        <div className="leftbar-group">
          <div className="pt-button-group pt-minimal">
            <AddServerButton history={this.props.history} />
          </div>
        </div>
        <div className="">
          <Tree>{this.getTree()}</Tree>
        </div>
      </div>
    );
  }
}

export const NavTree = connect((state, ownProps) => {
  return {
    servers: state.serversettings.servers,
    nr: state.numberrange.servers,
    navTreeItems: state.plugins.navTreeItems
  };
}, {})(withRouter(_NavTree));
