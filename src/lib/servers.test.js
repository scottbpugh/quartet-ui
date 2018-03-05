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
import {Server} from "./servers";

const mockServerData = {
  serverSettingName: "Server #1",
  hostname: "localhost",
  port: "80",
  ssl: false,
  username: "root",
  password: "toor",
  serverID: "824ae2dd-2411-4adf-a846-d9b310a33d4b"
};

test("builds the correct URL", () => {
  expect(new Server(mockServerData).url).toBe("http://localhost:80/");
});

test("builds the correct URL with path", () => {
  const serverDataWithPath = {...mockServerData, path: "my-clumsy-path-api/"};
  expect(new Server(serverDataWithPath).url).toBe(
    "http://localhost:80/my-clumsy-path-api/"
  );
});

test("changing server settings changes URL", () => {
  const myServer = new Server(mockServerData);
  expect(myServer.url).toBe("http://localhost:80/");
  myServer.setServerData({
    ...mockServerData,
    port: "443",
    ssl: true,
    path: "my-ssl-path/"
  });
  expect(myServer.url).toBe("https://localhost:443/my-ssl-path/");
});
/*
test("client is properly returned with getClient", () => {
  console.log("Hello");
  const myServer = new Server({...mockServerData, port: "8000"});
  myServer.getClient().then(client => {
    console.log(client.apis);
  });
});
*/
