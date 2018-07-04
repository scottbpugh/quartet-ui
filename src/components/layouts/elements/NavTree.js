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
import {Callout} from "@blueprintjs/core";
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

export class SubTree extends Component {
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
    this.getTree(props);
  }
  componentDidMount() {
    this.tree = this.getTree(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.tree = this.getTree(nextProps);
  }
  goTo = path => {
    this.props.history.push(path);
  };
  getTree = props => {
    let serverNodes = Object.keys(pluginRegistry._servers).map(serverID => {
      const server = pluginRegistry.getServer(serverID);
      let children = props.navTreeItems
        ? Object.keys(props.navTreeItems).map(component => {
            let ComponentName = pluginRegistry.getRegisteredComponent(
              component
            );
            return (
              <ComponentName depth={1} key={component} serverID={serverID} />
            );
          })
        : [];
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
    let isDark = this.props.theme === "polar" ? false : true;
    return (
      <div className="tree-wrapper">
        <div className="leftbar-group">
          <div
            className={classNames({
              "pt-button-group": true,
              "pt-minimal": true,
              "pt-dark": isDark
            })}>
            <button
              onClick={this.goTo.bind(this, "/")}
              tabIndex="0"
              className={classNames({
                "pt-button": true,
                "pt-icon-home": true
              })}
            />
            <AddServerButton history={this.props.history} isDark={isDark} />
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
    theme: state.layout.theme,
    pluginListUpdated: state.plugins.pluginListUpdated
  };
}, {})(withRouter(_NavTree));
window.qu4rtet.exports("components/layouts/elements/NavTree", this);
