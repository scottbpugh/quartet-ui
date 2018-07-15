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
import "./App.css";
import {
  Button,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider
} from "@blueprintjs/core";
import "@blueprintjs/core/dist/blueprint.css";
import MouseTrap from "mousetrap";
import {withRouter} from "react-router-dom";
import NavLink from "components/layouts/elements/NavLink";
import {FormattedMessage} from "react-intl";
import {SwitchLocale} from "components/layouts/elements/SwitchLocale";
import {SwitchTheme} from "components/layouts/elements/SwitchTheme";
import {NavTree} from "components/layouts/elements/NavTree";
import {ControlPanel} from "components/layouts/elements/ControlPanel";
import {connect} from "react-redux";
import {LeftPanel, Panels} from "components/layouts/Panels";
import classNames from "classnames";
import {Server} from "lib/servers";
import {pluginRegistry} from "plugins/pluginRegistration";
import {injectIntl} from "react-intl";
import QuartetLogo from "./QuartetLogo";

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
    const {servers} = this.props.serversettings;
    Object.keys(servers).forEach(serverID => {
      const server = new Server(servers[serverID]);
      pluginRegistry.registerServer(server);
      server.listApps();
    });
  }

  render() {
    return (
      <div
        className={classNames({
          App: true,
          "pt-dark": !!["dark", "dark-brown"].includes(this.props.theme),
          contrasted: this.props.theme === "contrasted",
          "dark-brown": this.props.theme === "dark-brown",
          polar: this.props.theme === "polar"
        })}>
        <header>
          <Navbar
            className={classNames({
              "pt-fixed-top": true,
              "pt-dark": this.props.theme !== "polar"
            })}>
            <NavbarGroup>
              <NavbarHeading>
                <QuartetLogo style={{width: "50%", height: "50%"}} />
              </NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align="right">
              <NavLink to="/" iconName="home">
                <FormattedMessage id="app.nav.dashboard" />
              </NavLink>
              <NavLink to="/plugins" iconName="pt-icon-exchange">
                <FormattedMessage id="app.nav.plugins" />
              </NavLink>
              <NavbarDivider />
              <SwitchLocale />
              <NavbarDivider />
              <SwitchTheme />
              <NavbarDivider />
              <Button className="pt-minimal" iconName="user" />
            </NavbarGroup>
          </Navbar>
        </header>

        <div className="wrapper">
          <Panels>
            <LeftPanel key="leftpanel">
              <ControlPanel />
              {/* Important not to rerender this component on router changes. */}
              <NavTree />
            </LeftPanel>
            {this.props.children}
          </Panels>
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
      intl: state.intl
    };
  },
  dispatch => {
    return {dispatch};
  }
)(_App);
export default withRouter(injectIntl(App));
window.qu4rtet.exports("components/App", this);
