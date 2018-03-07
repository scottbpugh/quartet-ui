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
import {connect} from "react-redux";
import "./NavTree.css";
import classNames from "classnames";
import {
  ContextMenuTarget,
  Menu,
  MenuItem,
  MenuDivider,
  Popover,
  Position,
  Icon
} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {pluginRegistry} from "plugins/pluginRegistration";
import {injectIntl} from "react-intl";
import {ServerMenu} from "./ServerMenu";
import {RegisterUserDialog} from "components/screens/auth/RegisterUser";

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
    this.state = {childrenNodes: [], collapsed: true};
  }
  toggleChildren = evt => {
    this.setState({collapsed: !this.state.collapsed}, () => {
      // go to path, for detail...
      //this.go();
    });
  };
  go = e => {
    e.stopPropagation(); // prevent parent go to be triggered.
    e.preventDefault();
    if (this.props.path) {
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
    return (
      <li
        className={classNames({
          arrow: true,
          collapsed: this.state.collapsed
        })}
        onClick={this.go}>
        <div
          className={classNames({
            "tree-node-content": true,
            "tree-node-content-active": this.props.active || false,
            [`tree-node-depth-${this.props.depth}`]: true
          })}>
          <a className="tree-node-link" onClick={this.toggleChildren}>
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

          <a
            className={classNames({
              [`tree-node-${this.props.nodeType}`]: true,
              "tree-node-link": true,
              "tree-node-active": this.props.active || false
            })}>
            <span className="tree-node-label">{this.props.children}</span>
          </a>
        </div>
        <SubTree collapsed={this.state.collapsed}>{childrenNodes}</SubTree>
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

class AddServerButton extends Component {
  goTo(path) {
    this.props.history.push(path);
  }
  render() {
    let isDark = this.props.theme === "polar" ? false : true;
    const addMenu = (
      <Menu
        className={classNames({
          "menu-padding-fix": true,
          "pt-dark": isDark
        })}>
        <MenuItem
          text={<FormattedMessage id="app.serverSettings.addAServer" />}
          onClick={this.goTo.bind(this, "/server-settings/")}
        />
      </Menu>
    );
    return (
      <div>
        <Popover
          className={classNames({"pt-dark": isDark})}
          content={addMenu}
          position={Position.RIGHT_CENTER}>
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

class _ServerNode extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false, registerDialogOpen: false};
  }
  componentDidMount() {
    this.activateNode(this.props.currentPath);
  }
  componentWillReceiveProps(nextProps) {
    this.activateNode(nextProps.currentPath);
  }
  renderContextMenu() {
    const {server, intl} = this.props;
    return (
      <ServerMenu
        toggleRegisterDialog={this.toggleRegisterDialog}
        intl={intl}
        server={server}
      />
    );
  }
  toggleRegisterDialog = () => {
    this.setState({registerDialogOpen: !this.state.registerDialogOpen});
  };
  activateNode(currentPath) {
    // set active state if in current path.
    // for some reason this.props.location.pathname doesn't get updated.
    // window.location.pathname does.
    const {serverID} = this.props.server;
    let regexp = new RegExp(`/${serverID}/?`);
    this.setState({active: regexp.test(currentPath)}, () => {
      console.log("done redrawing with", this.state.active);
    });
  }
  render() {
    const {server, intl, childrenNodes, children} = this.props;
    return (
      <TreeNode
        key={server.serverID}
        onContextMenu={this.renderContextMenu.bind(this)}
        nodeType="server"
        depth={0}
        path={`/server-details/${server.serverID}`}
        active={this.state.active}
        childrenNodes={childrenNodes ? childrenNodes : []}>
        {children}
        <RegisterUserDialog
          intl={intl}
          server={server}
          closeDialog={this.toggleRegisterDialog.bind(this)}
          isOpen={this.state.registerDialogOpen}
          theme={this.props.theme}
        />
      </TreeNode>
    );
  }
}

const ServerNode = connect((state, ownProps) => {
  return {
    currentPath: state.layout.currentPath,
    theme: state.layout.theme
  };
}, {})(injectIntl(withRouter(_ServerNode)));

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
    const {servers} = props;
    return Object.keys(pluginRegistry._servers).map(serverID => {
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
