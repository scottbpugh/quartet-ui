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
import React from "react";
import {Switch, Route} from "react-router";
import {BrowserRouter, Link} from "react-router-dom";
import App from "./components/App";
import Dashboard from "./components/screens/Dashboard";

export default (
  <App>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  </App>
);
