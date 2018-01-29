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
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import configureStore from "./store";
import {Provider} from "react-redux";
import routes from "./routes";
import {initialData} from "./reducers/serversettings";
import {initialData as nrData} from "./plugins/number-range/src/reducers/numberrange.js";

const initialState = {
  dashboard: {notifications: []},
  serversettings: initialData(),
  numberrange: nrData()
};

const store = configureStore(initialState);

ReactDOM.render(
  <Provider store={store}>{routes}</Provider>,
  document.getElementById("root")
);
registerServiceWorker();
