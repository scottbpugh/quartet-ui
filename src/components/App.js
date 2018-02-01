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

class App extends Component {
  render() {
    return (
      <div className="App pt-ui-text">
        <header>
          <Navbar className=".pt-dark">
            <NavbarGroup>
              <NavbarHeading>QU4RTET</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align="right">
              <NavLink to="/" iconName="home">
                Dashboard
              </NavLink>
              <NavLink to="/server-settings" iconName="cloud">
                Servers
              </NavLink>
              <NavLink to="/number-range/pools" iconName="cloud">
                Number Range
              </NavLink>
              <NavbarDivider />
              <Button className="pt-minimal" iconName="user" />
            </NavbarGroup>
          </Navbar>
        </header>
        <div className="wrapper">{this.props.children}</div>
      </div>
    );
  }
}

export default withRouter(App);
