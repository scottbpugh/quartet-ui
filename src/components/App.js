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

class _App extends Component {
  componentDidMount() {}
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
              <NavLink to="/server-settings" iconName="cloud">
                <FormattedMessage id="app.nav.servers" />
              </NavLink>
              <NavLink to="/number-range/pools" iconName="cloud">
                <FormattedMessage id="app.nav.numberRange" />
              </NavLink>
              <SwitchLocale />
              <NavbarDivider />
              <Button className="pt-minimal" iconName="user" />
            </NavbarGroup>
          </Navbar>
        </header>
        <div className="wrapper">
          <div className="main-container">
            <div className="left-panel pt-dark">
              <h4 className="left-panel-title pt-dark">
                <FormattedMessage id={this.props.pageTitle} />
              </h4>
              <div>
                <NavTree />
              </div>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

const App = connect(state => {
  return {
    pageTitle: state.layout.pageTitle
  };
}, {})(_App);
export default withRouter(App);
