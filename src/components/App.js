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
import NavLink from "./layouts/elements/NavLink";
import {FormattedMessage} from "react-intl";
import {SwitchLocale} from "./layouts/elements/SwitchLocale";
import {NavTree} from "./layouts/elements/NavTree";
import {ActionControls} from "./layouts/elements/ActionControls";
import {connect} from "react-redux";
import {loadPageTitle} from "../reducers/layout";
import {LeftPanel, Panels} from "./layouts/Panels";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {
  getRegisteredComponents,
  getUnregisteredComponents
} from "../plugins/pluginRegistration";

class _App extends Component {
  componentDidMount() {
    // inject components.

    let pluginComponents = getRegisteredComponents();
    for (let pluginComponentName in pluginComponents) {
      let entry = pluginComponents[pluginComponentName];
      this.props.dispatch({
        type: entry.action,
        payload: {
          pluginName: entry.pluginName,
          pluginComponentName: pluginComponentName
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.plugins) !== JSON.stringify(nextProps.plugins)
    ) {
      // add new components.
      let pluginComponents = getRegisteredComponents();
      for (let pluginComponentName in pluginComponents) {
        let entry = pluginComponents[pluginComponentName];
        this.props.dispatch({
          type: entry.action,
          payload: {
            pluginName: entry.pluginName,
            pluginComponentName: pluginComponentName
          }
        });
      }
      // remove unregistered componments.
      let disabledPluginComponents = getUnregisteredComponents();
      for (let pluginComponentName in disabledPluginComponents) {
        let entry = disabledPluginComponents[pluginComponentName];
        this.props.dispatch({
          type: entry.action,
          payload: {
            pluginName: entry.pluginName,
            pluginComponentName: pluginComponentName
          }
        });
      }
    }
  }
  render() {
    return (
      <div className="App pt-ui-text">
        <header>
          <Navbar className="pt-fixed-top">
            <NavbarGroup>
              <NavbarHeading>QU4RTET</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align="right">
              <NavLink to="/" iconName="home">
                <FormattedMessage id="app.nav.dashboard" />
              </NavLink>
              <NavLink to="/server-settings" iconName="cloud">
                <FormattedMessage id="app.nav.servers" />
              </NavLink>
              <NavLink to="/plugins" iconName="pt-icon-exchange">
                <FormattedMessage id="app.nav.plugins" />
              </NavLink>
              <SwitchLocale />
              <NavbarDivider />
              <Button className="pt-minimal" iconName="user" />
            </NavbarGroup>
          </Navbar>
        </header>

        <div className="wrapper">
          <Panels>
            <LeftPanel key="leftpanel">
              <div>
                <NavTree />
              </div>
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
      plugins: state.plugins.plugins
    };
  },
  dispatch => {
    return {dispatch: dispatch};
  }
)(_App);
export default withRouter(App);
