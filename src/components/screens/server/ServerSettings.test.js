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
import renderer from "react-test-renderer";
import {ServerSettings} from "./ServerSettings";
import {initialData} from "../../../reducers/serversettings";
import configureStore from "redux-mock-store";
import {MemoryRouter as Router, withRouter} from "react-router-dom";
import {IntlProvider, intlReducer} from "react-intl-redux";

const mockStore = configureStore();
let wrapper;
let store;

it("renders correctly", () => {
  store = mockStore({serversettings: initialData()});
  const props = {
    match: {
      params: {
        serverID: null
      }
    }
  };
  const serverSettings = renderer
    .create(
      <IntlProvider store={store}>
        <Router>
          <ServerSettings {...props} store={store} />
        </Router>
      </IntlProvider>
    )
    .toJSON();
  expect(serverSettings).toMatchSnapshot();
});
