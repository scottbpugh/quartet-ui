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
import "tools/mockStore"; // mock ipcRenderer, localStorage, ...
import renderer from "react-test-renderer";
import configureStore from "redux-mock-store";
import {MemoryRouter as Router, withRouter} from "react-router-dom";
import {IntlProvider, intlReducer} from "react-intl-redux";
import {Provider} from "react-redux";
import {mockStore, TestWrapper, initialState} from "tools/mockStore";
import {Server} from "lib/servers";
import {FormattedMessage} from "react-intl";
import {initialData} from "../../../reducers/serversettings";
import {ServerForm} from "./ServerForm";

it("renders correctly", () => {
  const store = mockStore(initialState);

  const serverForm = renderer
    .create(
      <TestWrapper>
        <Provider store={store}>
          <Router>
            <ServerForm
              formData={Server.getFormStructure()}
              saveButtonMsg={<FormattedMessage id="app.servers.addServer" />}
              submitCallback={() => {}}
            />
          </Router>
        </Provider>
      </TestWrapper>
    )
    .toJSON();
  expect(serverForm).toMatchSnapshot();
});
