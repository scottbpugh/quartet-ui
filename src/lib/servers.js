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

const APP_NAME = "core";

/**
 * Server - Holds data about a server and its settings, API client, ...
 */
export class Server {
  constructor(serverSettings) {
    this.serverID = serverSettings.serverID;
    this.serverSettings = serverSettings;
    this.client = null;
    // make server object available to core and plugins.
    pluginRegistry.registerServer(APP_NAME, this.serverID, this);
  }

  set serverSettings(serverSettings) {
    this._serverSettings = serverSettings;
    this.prepServerURL(this._serverSettings);
  }

  get serverSettings() {
    return this._serverSettings;
  }

  prepServerURL = serverSettings => {
    this.protocol = serverSettings.ssl === true ? "https" : "http";
    this.hostname = serverSettings.serverName;
    this.port = serverSettings.port || 80;
    this.path = serverSettings.path ? serverSettings.path : "";
    this.url = `${this.protocol}://${this.hostname}:${this.port}/${this.path}`;
    return this.url;
  };
}

/**
 * prepServerURL - Helper function to generate a URL.
 *
 * @param {object} server key/val pairs settings
 *
 * @return {string} Root URL
 */
export const prepServerURL = server => {
  let protocol = server.ssl === "true" ? "https" : "http";
  let hostname = server.serverName;
  let port = server.port || 80;
  let path = server.path ? server.path : "";
  return `${protocol}://${hostname}:${port}/${path}`;
};

/**
 * parseSchema - Parses the Swagger 2.0 schema to generate apis dynamically.
 *
 * @param {type} server Server setting object or partial object.
 *
 * @return {type}
 */
export const parseSchema = server => {
  // http://localhost:8000/schema/
  const url = prepServerURL(server);
};

/**
 * parseManifest - Gets the Qu4rtet manifest.
 *
 * @param {type} server Description
 *
 * @return {type} Description
 */
export const parseManifest = server => {
  //http://localhost:8000/manifest/quartet-manifest/
  // in this case server may be a full server object or just a stub with only host, port, path, and SSL on/off
};
