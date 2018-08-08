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
import Swagger from "swagger-client";
import {pluginRegistry} from "plugins/pluginRegistration";
import actions from "actions/serversettings";
import {showMessage} from "lib/message";
import base64 from "base-64";
import {
  fetchObject,
  fetchPageList,
  fetchListAll,
  deleteObject,
  fetchWithHeaders
} from "lib/server-api";

// all issues with fs see:
// https://github.com/electron/electron/issues/9920

const {ipcRenderer} = window.require("electron");

let _password = new WeakMap();
let _client = new WeakMap();

/* Listen for global credentials notifications */
ipcRenderer.on("credentialsRetrieved", (event, payload) => {
  pluginRegistry.getServer(payload.account).setPassword(payload.password);
  pluginRegistry.getServer(payload.account).listApps();
});

/*
  This class is meant to be used as an interface,
  so that plugins don't have the same unrestricted access
  to the swagger client, which contains the securities object.
*/
class SafeClient {
  constructor(realClient) {
    this.apis = realClient.apis;
    this.execute = this.getSandboxedExecute(realClient);
  }
  getSandboxedExecute = realClient => {
    return async function(executeObject) {
      // add securities programmatically.
      executeObject.securities = {
        authorized: realClient.securities,
        specSecurity: [realClient.spec.securityDefinitions]
      };
      return await realClient.execute(executeObject);
    };
  };
}

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
      authType,
      tokenType,
      username,
      password (optional, only required during create/update stage)
    }
    */
    // used to check if password has already been requested.
    this.setServerData(serverSettings);
    this.store = require("store").store;
    // make saved server object available to core and plugins.
    pluginRegistry.registerServer(this);
  }
  setCredentials = password => {
    ipcRenderer.send("setServerCredentials", {
      account: this.serverID,
      password: password
    });
  };
  getPassword = () => {
    this.loadingPassword = true;
    ipcRenderer.send("getServerCredentials", {account: this.serverID});
  };
  deletePassword = () => {
    ipcRenderer.send("deleteServerCredentials", {account: this.serverID});
  };
  setPassword = password => {
    this.password = null;
    _password.set(this, password);
    this.loadingPassword = false;
    // refetch client/app list.
    this.listApps(true);
  };

  fetchWithHeaders = async (path, req, contentType) => {
    return await fetchWithHeaders(this, path, req, contentType);
  };

  /**
   * fetchObject - fetches a single object from any Swagger API endpoint.
   *
   * @param {string} [operationId=]  The Swagger operation id
   * @param {object} [parameters={}] Parameter passed with the call.
   *
   * @return {object} An object from the API call.
   */
  fetchObject = async (operationId = "", parameters = {}) => {
    return await fetchObject(this, operationId, parameters);
  };

  deleteObject = async (operationId = "", parameters = {}) => {
    return await deleteObject(this, operationId, parameters);
  };

  /**
   * fetchPageList - Fetches a single list page.
   *
   * @param {type} operationId    The Swagger
   * @param {type} parameters     Parameters passed to the call (page...)
   *
   * @return {object} A response body
   */
  fetchPageList = async (operationId, parameters) => {
    return await fetchPageList(this, operationId, parameters, {});
  };

  /**
   * fetchListAll - Loops through all pages of a list and concats the result.
   *
   * @param {string} [operationId=]  Swagger operation id
   * @param {object} [parameters={}] Parameters passed to the call.
   * @param {array}  [results=[]]    The results, all objects for this API list.
   *
   * @return {type} Description
   */
  fetchListAll = async (operationId, parameters, results = []) => {
    return await fetchListAll(this, operationId, parameters, results);
  };

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
    if ("password" in serverSettings) {
      this.setCredentials(serverSettings.password);
    } else if (!this.passwordRequested) {
      this.getPassword();
    }
    this.protocol = this.ssl === true ? "https" : "http";
    this.port = !this.port ? 80 : this.port;
    this.path = !this.path && !serverSettings.path ? "" : this.path;
    this.url = this.getServerURL();
    this._client = null;
    this.manifest = null;
    this.authType = !this.authType ? "basic" : this.authType;
    this.tokenType = !this.tokenType ? "Token" : this.tokenType;
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
        help_text: "A path to interact with API (Optional), example /api"
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
        help_text: "SSL/TLS encryption"
      }
    },
    {
      name: "authType",
      defaultValue: initialValues.authType || "basic",
      description: {
        type: "choice",
        required: false,
        read_only: false,
        label: "Authentication Type",
        choices: {basic: "Basic", token: "Token"},
        help_text: "Basic or Token-based authentication"
      }
    },
    {
      name: "tokenType",
      defaultValue: initialValues.tokenType || "Token",
      description: {
        type: "text",
        required: false,
        read_only: false,
        label: "Token Type",
        help_text:
          "The token name used for authentication, case sensitive (Token, Bearer)"
      }
    },
    {
      name: "username",
      defaultValue: initialValues.username || null,
      description: {
        type: "text",
        required: true,
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
        name: "serverSettingName",
        value: this.serverSettingName,
        editable: true
      },
      {
        name: "authType",
        value: this.authType,
        editable: true
      },
      {name: "tokenType", value: this.tokenType, editable: true},
      {name: "username", value: this.username},
      {name: "serverID", value: this.serverID}
    ];
  };

  toJSON() {
    let json = {};
    this.getArrayFields().forEach(field => {
      json[field.name] = field.value;
    });
    return json;
  }

  getServerURL = () => {
    return `${this.protocol}://${this.hostname}:${this.port}/${this.path}`;
  };

  getServerURLWithCreds = () => {
    return `${this.protocol}://${this.username}:${this.password}@${
      this.hostname
    }:${this.port}/${this.path}`;
  };

  returnSecurities = async () => {
    if (this._securities) {
      // don't keep refetching.
      return this._securities;
    }
    if (this.authType === "basic" || !this.authType) {
      // default to basic.
      this._securities = {
        basic: {username: this.username, password: _password.get(this)}
      };
      return this._securities;
    } else if (this.authType === "token") {
      let response = await fetch(this.getServerURL() + "rest-auth/login/", {
        method: "post",
        contentType: "application/json",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.username,
          password: _password.get(this)
        })
      });
      if (response.ok) {
        let data = await response.json();
        this._securities = {apiKey: `${this.tokenType} ${data.key}`};
        return this._securities;
      }
    }
  };

  getAuthorization = async () => {
    try {
      let {username} = this;
      let password = _password.get(this);
      let securities = await this.returnSecurities();
      if (this.authType === "basic" || !this.authType) {
        let encodedBasicToken = base64.encode(username + ":" + password);
        // we're fetching the definition
        return `Basic ${encodedBasicToken}`;
      } else if (this.authType === "token") {
        return `${securities.apiKey}`;
      }
    } catch (error) {
      showMessage({
        type: "error",
        id: "app.servers.errorServerFetch",
        values: {serverName: this.serverSettingName, error: error}
      });
    }
  };

  parseSchema = async () => {
    let {url} = this;
    try {
      let securities = await this.returnSecurities();
      let client = await Swagger(`${url}schema/`, {
        securities: securities,
        requestInterceptor: async req => {
          req.headers.Authorization = await this.getAuthorization(securities);
          return req;
        }
      });
      // private instance.
      _client.set(this, new SafeClient(client));
    } catch (error) {
      showMessage({
        type: "error",
        id: "app.servers.errorServerFetch",
        values: {serverName: this.serverSettingName, error: error}
      });
    }
  };

  listApps = async (reset = false) => {
    if (!_password.get(this) && !this.loadingPassword) {
      // fetch password first.
      this.getPassword();
      return;
    }
    if (this.loadingPassword) {
      // prevent resetting race.
      return;
    }
    this.appList = [];
    this.store.dispatch({type: actions.resetAppList, payload: this.toJSON()});
    let client = await this._getClient(reset);

    try {
      this.appList = Object.keys(client.apis).filter(app => {
        return !app.startsWith("read-only-");
      });
      // let redux know we got our data
      this.store.dispatch({
        type: actions.appsListUpdated,
        payload: this.toJSON()
      });
    } catch (error) {
      // handle legacy.
      this.appList = [];
      // let redux know we got our data
      this.store.dispatch({
        type: actions.appsListUpdated,
        payload: this.toJSON()
      });
    }
  };
  /*
  This is the client for "apis" and "execute", it does not
  contain the securities.
  */
  getClient = async (reset = false) => {
    return this._client;
  };
  /*
  We don't make the real client available outside of this module.
  */
  _getClient = async (reset = false) => {
    if (this._client && reset === false) {
      return this._client;
    } else {
      // we don't have a client yet.
      // Fetch it.
      await this.parseSchema(true);
      this._client = {
        apis: _client.get(this).apis,
        execute: _client.get(this).execute
      };
      return this._client;
    }
  };

  getManifest = async (reset = false) => {
    if (!this.manifest && reset) {
      let client = await this._getClient();
      let result = await client.apis.manifest.quartet_manifest_list();
      this.manifest = result.body;
      return this.manifest;
    } else {
      return this.manifest;
    }
  };
}
