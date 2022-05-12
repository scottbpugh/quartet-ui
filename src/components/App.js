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

import React, { Component } from "react";
import "./App.css";
import {
  Button,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider
} from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import MouseTrap from "mousetrap";
import { withRouter } from "react-router-dom";
import NavLink from "components/layouts/elements/NavLink";
import { FormattedMessage } from "react-intl";
import { NavTree } from "components/layouts/elements/NavTree";
import { ControlPanel } from "components/layouts/elements/ControlPanel";
import { connect } from "react-redux";
import { LeftPanel, Panels } from "components/layouts/Panels";
import classNames from "classnames";
import { Server } from "lib/servers";
import { pluginRegistry } from "plugins/pluginRegistration";
import { injectIntl } from "react-intl";
import QuartetLogo from "./QuartetLogo";
import { ScreenErrorBoundary } from "./ErrorBoundary";
import {IconNames} from "@blueprintjs/icons";
import SelectLocale from "./layouts/elements/SelectLocale";
import SelectTheme from "./layouts/elements/SelectTheme";

// useful piece for testing. Never use this global in code.
window.pluginRegistry = pluginRegistry;

class _App extends Component {
  constructor(props) {
    super(props);
    pluginRegistry.registerKeybinding("core", "backspace", this.goBack);
  }
  componentWillUnmount() {
    pluginRegistry.unregisterKeybinding("core", "backspace");
  }
  goBack = () => {
    if (this.props.currentPath !== "/") {
      this.props.history.goBack();
    }
  };
  goForward() {
    this.props.history.goForward();
  }
  componentDidMount() {
    // make intl easily available to plugins.
    pluginRegistry.registerIntl(this.props.intl);
    // make history available to non-component code
    pluginRegistry.registerHistory(this.props.history);
    // redirect to / first thing. Fix for electron build.
    // While it was tempting to redirect to the currentPath persisted
    // through local storage, it can be dangerous if items or plugins have been
    // removed from the db/disabled as plugins.
    // if (process.env.NODE_ENV !== "development") {
    this.props.history.push("/");
    // }
    // load the necessary server data.
    this.processServers();
  }

  processServers() {
    // pull the server data from redux, instantiate Server classes based on this.
    // Register them with the pluginRegistry so that core and plugins can use
    // the class instances for their own API calls etc...
    const { servers } = this.props.serversettings;
    Object.keys(servers).forEach(serverID => {
      const server = new Server(servers[serverID]);
      pluginRegistry.registerServer(server);
      server.listApps();
    });
  }

  nav(newPath){
    this.props.history.push(newPath)
  }

  render() {
    return (
      <div
        className={classNames('application', {
          App: true,
          "bp3-dark": !!["dark", "dark-brown"].includes(this.props.theme),
          contrasted: this.props.theme === "contrasted",
          "dark-brown": this.props.theme === "dark-brown",
          polar: this.props.theme === "polar"
        })}>
        <header>
          <Navbar
            className={classNames('navbar', {
              "bp3-fixed-top": true,
              "bp3-dark": this.props.theme !== "polar",
            })}>
            <NavbarGroup>
              <NavbarHeading>
                <QuartetLogo style={{ width: "50%", height: "50%" }} />
              </NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align="right">
              <NavLink to="/" icon="home" minimal={true}>
                <FormattedMessage id="app.nav.dashboard" />
              </NavLink>
              <NavLink to="/plugins" icon="exchange">
                <FormattedMessage id="app.nav.plugins" />
              </NavLink>
              <NavbarDivider />
              <SelectLocale />
              <NavbarDivider />
              <SelectTheme />
              <NavbarDivider />
              <Button minimal={true} icon="user" />
            </NavbarGroup>
          </Navbar>
        </header>

        <div className="wrapper">
          <ScreenErrorBoundary history={this.props.history}>
            <Panels>
              <LeftPanel key="leftpanel">
                <ControlPanel />
                {/* Important not to rerender this component on router changes. */}
                <NavTree />
              </LeftPanel>
              {this.props.children}
            </Panels>
          </ScreenErrorBoundary>
        </div>
      </div>
    );
  }
}

const App = connect(
  state => {
    return {
      pageTitle: state.layout.pageTitle,
      currentPath: state.layout.currentPath,
      plugins: state.plugins.plugins,
      navTreeItems: state.plugins.navTreeItems,
      theme: state.layout.theme,
      serversettings: state.serversettings,
      currentLocale: state.intl.locale,
      intl: state.intl,
      visibility: state.layout.visibility,
      serverVisibility: state.layout.serverVisibility,
      serverVis: state.layout.serverVis,
    };
  },
  dispatch => {
    return { dispatch };
  }
)(_App);
export default withRouter(injectIntl(App));
