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
import {withRouter} from "react-router-dom";
import NavLink from "components/layouts/elements/NavLink";
import {FormattedMessage} from "react-intl";
import {SwitchLocale} from "components/layouts/elements/SwitchLocale";
import {SwitchTheme} from "components/layouts/elements/SwitchTheme";
import {NavTree} from "components/layouts/elements/NavTree";
import {connect} from "react-redux";
import {LeftPanel, Panels} from "components/layouts/Panels";
import classNames from "classnames";
import {Server} from "lib/servers";
import {pluginRegistry} from "plugins/pluginRegistration";
import QuartetLogo from "./QuartetLogo";

// useful piece for testing. Never use this global in code.
window.pluginRegistry = pluginRegistry;

class _App extends Component {
  componentDidMount() {
    // redirect to / first thing. Fix for electron build.
    // While it was tempting to redirect to the currentPath persisted
    // through local storage, it can be dangerous if items or plugins have been
    // removed from the db/disabled as plugins.
    if (process.env.NODE_ENV !== "development") {
      this.props.history.push("/");
    }
    // load the necessary server data.
    this.processServers();
  }
  processServers() {
    // pull the server data from redux, instantiate Server classes based on this.
    // Register them with the pluginRegistry so that core and plugins can use
    // the class instances for their own API calls etc...
    const {servers} = this.props.serversettings;
    Object.keys(servers).forEach(serverID => {
      pluginRegistry.registerServer(new Server(servers[serverID]));
    });
  }
  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <div
        className={classNames({
          App: true,
          "pt-dark": ["dark", "dark-brown"].includes(this.props.theme)
            ? true
            : false,
          contrasted: this.props.theme === "contrasted" ? true : false,
          "dark-brown": this.props.theme === "dark-brown" ? true : false,
          polar: this.props.theme === "polar" ? true : false
        })}>
        <header>
          <Navbar
            className={classNames({
              "pt-fixed-top": true,
              "pt-dark": this.props.theme === "polar" ? false : true
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
      theme: state.layout.theme,
      serversettings: state.serversettings
    };
  },
  dispatch => {
    return {dispatch: dispatch};
  }
)(_App);
export default withRouter(App);
