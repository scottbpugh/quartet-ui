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
import base64 from "base-64";
import {showMessage} from "lib/message";

/**
 * prepHeaders - Prepares the headers to be sent.
 *
 * @param {object} server A server setting object
 *
 * @return {object} A request init object with headers.
 */
const prepHeaders = (server, method = "GET") => {
  //let username = server.username;
  //let password = server.password;
  let headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");
  /*headers.append(
    "Authorization",
    "Basic " + base64.encode(username + ":" + password)
  );*/
  return {
    method: method,
    headers: headers,
    mode: "cors"
  };
};

export const getRegistrationFormStructure = server => {
  return fetch(
    `${server.url}rest-auth/registration/`,
    prepHeaders(server, "OPTIONS")
  )
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      return error;
    });
};
