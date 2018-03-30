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
import "tools/mockStore"; // mock ipcRenderer, localStorage, ...
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import "./NavTree.css";
import classNames from "classnames";
import {ContextMenuTarget, Icon, Callout} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {pluginRegistry} from "plugins/pluginRegistration";
import {ServerNode} from "components/screens/server/ServerNode";
import {AddServerButton} from "components/screens/server/AddServerButton";

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
  render() {
    return (
      <TransitionGroup
        component="ul"
        style={{margin: 0, padding: 0, width: "100%", display: "block"}}>
        {!this.props.collapsed
          ? this.props.children.map((item, i) => {
              return <Fade key={i}>{item}</Fade>;
            })
          : null}
      </TransitionGroup>
    );
  }
}

class _TreeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {childrenNodes: [], collapsed: true, persistent: false};
  }
  toggleChildren = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    this.setState({collapsed: !this.state.collapsed});
  };
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
    let collapsed = this.state.collapsed;
    return (
      <li
        className={classNames({
          arrow: true,
          collapsed: collapsed
        })}
        onClick={this.go}>
        <div
          className={classNames({
            "tree-node-content": true,
            "tree-node-content-active": this.props.active || false,
            [`tree-node-depth-${this.props.depth}`]: true
          })}>
          <a onClick={this.toggleChildren}>
            <span
              className={classNames({
                "arrow-straight": collapsed,
                "arrow-rotated": !collapsed
              })}>
              <Icon
                iconName="pt-icon-chevron-right"
                style={{visibility: expandable ? "visible" : "hidden"}}
              />
            </span>
          </a>

          <a
            className={classNames({
              [`tree-node-${this.props.nodeType}`]: true,
              "tree-node-link": true,
              "tree-node-active": this.props.active || false
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
export const TreeNode = withRouter(_TreeNode);

class Tree extends Component {
  render() {
    return <ul className="tree-root">{this.props.children}</ul>;
  }
}

/*
  Nav tree doesn't rerender for every path change. This is to keep the correct state
  in terms of expansions (expanded nodes are not all necessarily the current one.)
  At some point we might want to move the expanded state to redux to make it persistent
  across sessions.
*/
class _NavTree extends Component {
  constructor(props) {
    super(props);
    this.tree = this.getTree(props);
  }
  componentDidMount() {
    this.tree = this.getTree(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.tree = this.getTree(nextProps);
  }
  getTree = props => {
    let serverNodes = Object.keys(pluginRegistry._servers).map(serverID => {
      const server = pluginRegistry.getServer(serverID);
      let children = Object.keys(props.navTreeItems).map(component => {
        let ComponentName = pluginRegistry.getRegisteredComponent(component);
        return <ComponentName depth={1} key={component} serverID={serverID} />;
      });
      return (
        <ServerNode
          server={server}
          key={serverID}
          nodeType="server"
          depth={0}
          childrenNodes={children ? children : []}>
          {server.serverSettingName}
        </ServerNode>
      );
    });
    if (serverNodes.length === 0) {
      // placeholder if no server.
      return (
        <Callout className="pt-icon-info-sign no-server-info">
          <FormattedMessage id="app.servers.noServerMsg" />
        </Callout>
      );
    }
    return serverNodes;
  };
  render() {
    return (
      <div className="tree-wrapper">
        <div className="leftbar-group">
          <div className="pt-button-group pt-minimal">
            <AddServerButton
              theme={this.props.theme}
              history={this.props.history}
            />
          </div>
        </div>
        <div style={{width: "100%"}}>
          <Tree>{this.tree}</Tree>
        </div>
      </div>
    );
  }
}

export const NavTree = connect((state, ownProps) => {
  return {
    servers: state.serversettings.servers,
    navTreeItems: state.plugins.navTreeItems,
    intl: state.intl,
    theme: state.layout.theme
  };
}, {})(withRouter(_NavTree));
