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
import "tools/mockStore"; // mock ipcRenderer, localStorage, ...

import {Server} from "lib/servers";
import {pluginRegistry} from "./pluginRegistration";

it("adds a server when registering a server", () => {
  pluginRegistry.registerServer(new Server({serverID: "random-id"}));
  expect(pluginRegistry.getServer("random-id")).toMatchSnapshot();
  expect(Object.keys(pluginRegistry._servers).length).toEqual(1);
});

it("removes a server when triggering removeServer", () => {
  pluginRegistry.registerServer(new Server({serverID: "random-id"}));
  expect(pluginRegistry.getServer("random-id")).toMatchSnapshot();
  // making sure the server is properly registered here one more time.
  expect(Object.keys(pluginRegistry._servers).length).toEqual(1);
  pluginRegistry.removeServer(pluginRegistry.getServer("random-id"));
  expect(Object.keys(pluginRegistry._servers).length).toEqual(0);
});

it("can retrieve a server based on server object or serverID", () => {
  const s = new Server({serverID: "random-id"});
  pluginRegistry.registerServer(s);
  expect(pluginRegistry.getServer(s)).toMatchSnapshot();
});
