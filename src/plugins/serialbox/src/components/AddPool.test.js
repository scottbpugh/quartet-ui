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
import "./tools/MockQu4rtet";
const {
  TestWrapper,
  mockStore,
  initialState,
  updateRegistryIntl
} = window.require("./tools/mockStore");
const React = window.require("react");
const renderer = require("react-test-renderer");
const Router = window.require("react-router-dom").MemoryRouter;
const {Provider} = window.require("react-redux");
import {AddPool} from "./AddPool";
const {Server} = window.require("./lib/servers");
const {pluginRegistry} = window.require("./plugins/pluginRegistration");

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
