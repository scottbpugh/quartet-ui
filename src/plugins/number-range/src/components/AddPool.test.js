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
import "tools/mockStore"; // mock ipcRenderer, localStorage, ...
import renderer from "react-test-renderer";
import {AddPool} from "./AddPool";
import {MemoryRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import {
  mockStore,
  TestWrapper,
  initialState,
  updateRegistryIntl
} from "tools/mockStore";
import {Server} from "lib/servers";
import {pluginRegistry} from "plugins/pluginRegistration";

it.skip("renders correctly", () => {
  let store = mockStore(initialState);

  const props = {
    match: {
      params: {
        serverID: "d0246781-67c6-474b-8ab0-29de61b6e6bb"
      }
    }
  };
  pluginRegistry.registerServer(
    new Server(
      initialState.serversettings.servers[
        "d0246781-67c6-474b-8ab0-29de61b6e6bb"
      ]
    )
  );

  updateRegistryIntl(initialState.intl.locale, initialState.intl.messages);

  const addPool = renderer
    .create(
      <TestWrapper>
        <Provider store={store}>
          <Router>
            <AddPool {...props} />
          </Router>
        </Provider>
      </TestWrapper>
    )
    .toJSON();
  expect(addPool).toMatchSnapshot();
});
