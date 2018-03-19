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
import "./index.css";
import "typeface-heebo";
import {Provider} from "react-redux";
import {IntlProvider} from "react-intl-redux";
import {Router} from "react-router-dom";
import RouteSwitcher from "./routes";
import {store} from "./store";
import {routeLocationDidUpdate} from "reducers/layout";
import {createBrowserHistory} from "history";
import {showMessage} from "lib/message";
const browserHistory = createBrowserHistory();

browserHistory.listen(location => {
  store.dispatch(routeLocationDidUpdate(location));
});

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider>
      <Router history={browserHistory}>
        <RouteSwitcher />
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById("root")
);
