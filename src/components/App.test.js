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

import React from "react";
import ReactDOM from "react-dom";
import "tools/mockStore"; // mock ipcRenderer, localStorage, ...
import App from "./App";
import {withRouter} from "react-router-dom";
import {IntlProvider} from "react-intl-redux";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    withRouter(
      <IntlProvider>
        <App />
      </IntlProvider>
    ),
    div
  );
});
