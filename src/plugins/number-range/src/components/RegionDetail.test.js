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
import renderer from "react-test-renderer";
import {RegionDetail} from "./RegionDetail";
import {mockStore, TestWrapper, initialState} from "tools/mockStore";
import {flattenMessages} from "lib/flattenMessages";
import messages from "messages";
import nrmessages from "../messages";
import {pluginRegistry} from "plugins/pluginRegistration";
import {Server} from "lib/servers";

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
    expect(regionDetailScreen).toMatchSnapshot();
  });
});
