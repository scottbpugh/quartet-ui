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

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <Navbar className=".pt-dark">
            <NavbarGroup>
              <NavbarHeading>QU4RTET</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align="right">
              <Button className="pt-minimal" iconName="home">
                Dashboard
              </Button>
              <Button className="pt-minimal" iconName="document">
                Files
              </Button>
              <NavbarDivider />
              <Button className="pt-minimal" iconName="user" />
              <Button className="pt-minimal" iconName="notifications" />
              <Button className="pt-minimal" iconName="cog" />
            </NavbarGroup>
          </Navbar>
        </header>
        <div className="wrapper">{this.props.children}</div>
      </div>
    );
  }
}

export default App;
