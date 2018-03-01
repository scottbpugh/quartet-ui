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
import Swagger from "swagger-client";
import {pluginRegistry} from "plugins/pluginRegistration";

/**
 * Server - Holds data about a server and its settings, API client, ...
 */
export class Server {
  constructor(serverSettings) {
    /*
    Following object should be passed.
    {
      serverSettingName,
      serverName,
      port,
      ssl,
      serverID,
      path,
      username,
      password
    }
    */
    this.setServerData(serverSettings);
    // make saved server object available to core and plugins.
    pluginRegistry.registerServer(this);
  }

  setServerData = serverSettings => {
    /*
    Following object should be passed.
    {
      serverSettingName,
      serverName,
      port,
      ssl,
      serverID,
      path,
      username,
      password
    */
    // allow for partial updates.
    for (let key in serverSettings) {
      if (serverSettings[key] !== "" || serverSettings[key] !== undefined) {
        this[key] = serverSettings[key];
      }
    }
    this.protocol = this.ssl === true ? "https" : "http";
    this.port = !this.port ? 80 : this.port;
    this.path = !this.path && !serverSettings.path ? "" : this.path;
    this.url = this.getServerURL();
    this._client = null;
    this.manifest = null;
  };

  getServerURL = () => {
    return `${this.protocol}://${this.serverName}:${this.port}/${this.path}`;
  };

  parseSchema = () => {
    return new Promise((resolve, reject) => {
      Swagger(this.url + "schema/")
        .then(client => {
          // swagger-js client is available.
          // client.spec / client.originalSpec / client.errors
          resolve(client);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  getClient = () => {
    return new Promise((resolve, reject) => {
      if (this._client) {
        resolve(this._client);
      } else {
        // we don't have a client yet.
        // Fetch it.
        this.parseSchema().then(client => {
          this._client = client;
          resolve(this._client);
        });
      }
    });
  };

  getManifest = () => {
    new Promise((resolve, reject) => {
      if (!this.manifest) {
        this.getClient().then(client => {
          client.apis.manifest.quartet_manifest_list().then(result => {
            this.manifest = result.body;
            resolve(result.body);
          });
        });
      } else {
        resolve(this.manifest);
      }
    });
  };
}
