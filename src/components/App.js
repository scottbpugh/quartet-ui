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
import {NavTree} from "components/layouts/elements/NavTree";
import {ActionControls} from "components/layouts/elements/ActionControls";
import {connect} from "react-redux";
import {loadPageTitle} from "reducers/layout";
import {LeftPanel, Panels} from "components/layouts/Panels";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {
  getRegisteredComponents,
  getUnregisteredComponents
} from "../plugins/pluginRegistration";

class _App extends Component {
  componentWillReceiveProps(nextProps) {}
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
                {/* Important not to rerender this component on router changes. */}
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
      currentPath: state.layout.currentPath,
      plugins: state.plugins.plugins
    };
  },
  dispatch => {
    return {dispatch: dispatch};
  }
)(_App);
export default withRouter(App);
