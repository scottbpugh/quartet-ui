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

import "tools/MockQu4rtet.js";
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
const {flattenMessages} = window.require("./lib/flattenMessages");
const messages = window.require("./messages").default;
import nrmessages from "../messages";
import {RegionDetail} from "./RegionDetail";

let locale = "en-US";
const newIntl = {
  ...initialState.intl,
  messages: flattenMessages({...messages[locale], ...nrmessages[locale]})
};

const pluginData = {
  ...initialState,
  serversettings: {servers: {fakeid: {serverID: "fakeid"}}},
  numberrange: {
    servers: {
      fakeid: {
        server: {
          serverID: "fakeid",
          password: "toor",
          username: "root",
          port: "80",
          serverName: "localhost",
          serverSettingName: "fake server",
          ssl: false,
          path: ""
        },
        pools: [
          {
            sequentialregion_set: [],
            created_date: "2018-02-12T14:56:11.462232Z",
            modified_date: "2018-02-12T14:56:11.462279Z",
            readable_name: "Fake Pool",
            machine_name: "fakepool",
            active: true,
            request_threshold: 50000
          }
        ]
      }
    },
    region: {},
    currentRegions: []
  },
  intl: newIntl
};

const store = mockStore(pluginData);

it("renders correctly a pool with no region", () => {
  let server = pluginData.numberrange.servers.fakeid.server;
  pluginRegistry.registerServer(new Server(server));
  const promise = Promise.resolve({
    statusCode: 200,
    ok: true,
    body: []
  });
  window.fetch = jest.fn().mockImplementation(() => promise);
  const regionDetailScreen = renderer
    .create(
      <TestWrapper locale={locale} messages={newIntl.messages} store={store}>
        <RegionDetail
          store={store}
          match={{params: {serverID: "fakeid", pool: "fakepool"}}}
          server={server}
        />
      </TestWrapper>
    )
    .toJSON();
  return promise.then(data => {
    console.log("Triggered", data);
    expect(regionDetailScreen).toMatchSnapshot();
  });
});
