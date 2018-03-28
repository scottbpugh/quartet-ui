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

import {prepHeaders} from "lib/auth-api";
import {showMessage} from "lib/message";
import base64 from "base-64";
var request = require("request");

export const fileUpload = (server, rule, fileObject) => {
  const reader = new FileReader();
  var data = new FormData();
  let headers = new Headers();
  headers.append(
    "Authorization",
    "Basic " + base64.encode(server.username + ":" + server.password)
  );
  data.append("file", fileObject);
  fetch(
    `${server.url}capture/quartet-capture/?rule=${
      rule.name
    }&run-immediately=true`,
    {
      method: "POST",
      headers: headers,
      body: data
    }
  )
    .then(resp => {
      resp.json().then(data => {
        showMessage({type: "success", msg: data});
      });
    })
    .catch(resp => {});
};

export const getRuleFormStructure = server => {
  return fetch(`${server.url}capture/rules/`, prepHeaders(server, "OPTIONS"))
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
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

export const getTaskFormStructure = server => {
  return fetch(`${server.url}capture/tasks/`, prepHeaders(server, "OPTIONS"))
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
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

export const getStepFormStructure = server => {
  return fetch(`${server.url}capture/steps/`, prepHeaders(server, "OPTIONS"))
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
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
