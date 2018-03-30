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

import {showMessage} from "lib/message";
import base64 from "base-64";

export const fileUpload = (server, rule, fileObject) => {
  let data = new FormData();
  let headers = new Headers();
  headers.append(
    "Authorization",
    "Basic " + base64.encode(server.username + ":" + server.password)
  );
  headers.append("Accept", "application/json");
  data.append("file", fileObject);
  fetch(`${server.url}capture/quartet-capture/?rule=${rule.name}`, {
    method: "POST",
    headers: headers,
    body: data
  })
    .then(resp => {
      resp
        .json()
        .then(data => {
          if (!resp.ok) {
            showMessage({type: "error", msg: data.detail});
          } else {
            showMessage({type: "success", msg: data});
          }
        })
        .catch(e => {
          showMessage({
            type: "error",
            id: "plugins.capture.processFileError"
          });
        });
    })
    .catch(resp => {
      showMessage({
        type: "error",
        id: "plugins.capture.processFileError"
      });
    });
};
