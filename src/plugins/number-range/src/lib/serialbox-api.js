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
import base64 from "base-64";

export const getPools = server => {
  let protocol = server.ssl === "true" ? "https" : "http";
  let hostname = server.serverName;
  let port = server.port || 80;
  let username = server.username;
  let password = server.password;
  let path = server.path + "";
  let headers = new Headers();
  window.headers = headers;
  headers.append("Accept", "application/json");
  headers.append(
    "Authorization",
    "Basic " + base64.encode(username + ":" + password)
  );
  let initReq = {
    method: "GET",
    headers: headers,
    credentials: "include",
    mode: "cors"
  };
  let url = `${protocol}://${hostname}:${port}/${path}pools/`;
  return fetch(url, initReq)
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      debugger;
      return error;
    });
};

window.getPools = getPools;
