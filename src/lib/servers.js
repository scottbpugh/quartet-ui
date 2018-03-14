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
import actions from "actions/serversettings";

/**
 * Server - Holds data about a server and its settings, API client, ...
 */
export class Server {
  constructor(serverSettings) {
    /*
    Following object should be passed.
    {
      serverSettingName,
      hostname,
      port,
      ssl,
      serverID,
      path,
      username,
      password
    }
    */
    this.setServerData(serverSettings);
    this.store = require("store").store;
    // make saved server object available to core and plugins.
    pluginRegistry.registerServer(this);
  }

  setServerData = serverSettings => {
    /*
    Following object should be passed.
    {
      serverSettingName,
      hostname,
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
    this.appList = [];
  };
  getFormStructure = () => {
    return Server.getFormStructure(this.toJSON());
  };
  static getFormStructure = (initialValues = {}) => [
    {
      name: "serverSettingName",
      defaultValue: initialValues.serverSettingName || null,
      description: {
        type: "text",
        required: true,
        read_only: false,
        label: "Server Setting Name",
        help_text:
          "The label that will be used for this server connection setting."
      }
    },
    {
      name: "serverID",
      defaultValue: initialValues.serverID || null,
      description: {
        type: "hidden",
        required: false,
        read_only: false,
        label: "Server ID",
        help_text: "Hidden Server ID"
      }
    },
    {
      name: "hostname",
      defaultValue: initialValues.hostname || null,
      description: {
        type: "text",
        required: true,
        read_only: false,
        label: "Server Hostname",
        help_text:
          "A hostname or IP address, example localhost, serial-box.com, or 192.168.5.10."
      }
    },
    {
      name: "port",
      defaultValue: initialValues.port || null,
      description: {
        type: "number",
        required: true,
        read_only: false,
        label: "Port Number",
        min_value: 1,
        max_value: 65535,
        help_text: "A port to connect to. Example, 80, 8080, 443, ..."
      }
    },
    {
      name: "path",
      defaultValue: initialValues.path || "",
      description: {
        type: "text",
        required: false,
        read_only: false,
        label: "Root Path",
        helperText: "A path to interact with API (Optional), example /api"
      }
    },
    {
      name: "ssl",
      defaultValue: initialValues.ssl || false,
      description: {
        type: "boolean",
        required: false,
        read_only: false,
        label: "SSL/TLS",
        helperText: "SSL/TLS encryption"
      }
    },
    {
      name: "username",
      defaultValue: initialValues.username || null,
      description: {
        type: "text",
        required: false,
        read_only: false,
        label: "Username",
        help_text: "Basic Auth Username"
      }
    },
    {
      name: "password",
      defaultValue: initialValues.password || null,
      description: {
        type: "password",
        required: false,
        read_only: false,
        label: "Password",
        help_text: "Basic Auth Password"
      }
    }
  ];
  getArrayFields = () => {
    return [
      {name: "protocol", value: this.protocol, editable: true},
      {name: "port", value: this.port, editable: true},
      {name: "path", value: this.path, editable: true},
      {name: "ssl", value: this.ssl, editable: true},
      {name: "url", value: this.url, editable: false},
      {name: "hostname", value: this.hostname, editable: true},
      {
        name: "serverSettingsName",
        value: this.serverSettingName,
        editable: true
      },
      {name: "username", value: this.username},
      {name: "serverID", value: this.serverID}
    ];
  };

  toJSON() {
    return {
      serverID: this.serverID,
      protocol: this.protocol,
      port: this.port,
      path: this.path,
      ssl: this.ssl,
      hostname: this.hostname,
      serverSettingName: this.serverSettingName,
      url: this.url,
      appList: this.appList,
      username: this.username,
      password: this.password
    };
  }

  getServerURL = () => {
    return `${this.protocol}://${this.hostname}:${this.port}/${this.path}`;
  };
  getServerURLWithCreds = () => {
    return `${this.protocol}://${this.username}:${this.password}@${
      this.hostname
    }:${this.port}/${this.path}`;
  };

  parseSchema = () => {
    let url = this.url;
    return new Promise((resolve, reject) => {
      Swagger({
        url: `${url}schema/`
        /*  authorizations: {
          basic: new Swagger.PasswordAuthorization(this.username, this.password)
        }*/
      })
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

  listApps = () => {
    if (this.appList.length === 0) {
      this.getClient()
        .then(client => {
          this.appList = Object.keys(client.apis);
          // let redux know we got our data
          this.store.dispatch({
            type: actions.appsListUpdated,
            payload: this.toJSON()
          });
        })
        .catch(error => {
          // handle legacy.
          this.appList = [];
          // let redux know we got our data
          this.store.dispatch({
            type: actions.appsListUpdated,
            payload: this.toJSON()
          });
        });
    }
  };

  getClient = () => {
    return new Promise((resolve, reject) => {
      if (this._client) {
        resolve(this._client);
      } else {
        // we don't have a client yet.
        // Fetch it.
        this.parseSchema()
          .then(client => {
            this._client = client;
            resolve(this._client);
          })
          .catch(error => {
            reject(error);
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
