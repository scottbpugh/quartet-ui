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
import {getSyncValidators} from "components/elements/forms";

/**
 * prepHeaders - Prepares the headers to be sent.
 *
 * @param {object} server A server setting object
 *
 * @return {object} A request init object with headers.
 */
export const prepHeaders = (server, method = "GET") => {
  //let username = server.username;
  //let password = server.password;
  let headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");
  return {
    method: method,
    headers: headers,
    mode: "cors"
  };
};

export const prepHeadersAuth = (server, method = "GET") => {
  //let username = server.username;
  //let password = server.password;
  let headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");
  headers.append(
    "Authorization",
    "Basic " + base64.encode(server.username + ":" + server.password)
  );
  return {
    method: method,
    headers: headers,
    mode: "cors"
  };
};

export const getFormInfo = (server, path, createForm, processField) => {
  return fetch(`${server.url}${path}`, prepHeaders(server, "OPTIONS"))
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      // parse the values and filter to the one that are not readonly.
      let postFields = data.actions.POST;
      let formStructure = Object.keys(postFields)
        .map(field => {
          if (postFields[field].read_only === false) {
            return {name: field, description: postFields[field]};
          } else {
            return null;
          }
        })
        .filter(fieldObj => {
          if (processField) {
            return processField(fieldObj);
          }
          if (fieldObj) {
            // create sync validation arrays.
            fieldObj.validate = getSyncValidators(fieldObj);
            return true;
          }
          return false;
        });
      createForm(formStructure);
    })
    .catch(error => {
      showMessage({
        type: "danger",
        id: "app.servers.errorFormFetch",
        values: {error: error, serverName: server.serverSettingName}
      });
      throw error;
    });
};
