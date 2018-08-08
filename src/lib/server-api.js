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
import {getSyncValidators} from "components/elements/forms";
import {pluginRegistry} from "plugins/pluginRegistration";

/**
 * prepHeadersAuth - Prepares the headers to be sent.
 *
 * @param {object} server A server setting object
 *
 * @return {object} A request init object with headers and basic auth.
 */
const prepHeadersAuth = async (server, method = "GET") => {
  const headers = new Headers();
  headers.append("Accept", "application/json");
  //headers.append("Content-Type", "application/json");
  headers.append(
    "Authorization",
    await pluginRegistry.getServer(server.serverID).getAuthorization()
  );
  return {
    method,
    headers,
    mode: "cors"
  };
};

/**
 * getFormInfo - Returns an object with a form structure to be used by PageForm/redux form
 *
 * @param {A server object} server       Description
 * @param {Path to endpoint} path         Description
 * @param {Callback to set the state with formStructure} createForm   Description
 * @param {type} processField Description
 *
 */
export const getFormInfo = async (server, path, createForm, processField) => {
  return fetch(`${server.url}${path}`, await prepHeadersAuth(server, "OPTIONS"))
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      // parse the values and filter to the one that are not readonly.
      try {
        const postFields = data.actions.POST;
        const formStructure = Object.keys(postFields)
          .map(field => {
            if (
              field === "id" ||
              (postFields[field].type === "field" &&
                postFields[field].read_only === true)
            ) {
              return null;
            }
            return {name: field, description: postFields[field]};
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
      } catch (e) {
        if (e.message.startsWith("Cannot read property 'POST'")) {
          pluginRegistry.getHistory().push("/access-denied");
        } else {
          throw e;
        }
      }
    })
    .catch(error => {
      showMessage({
        type: "danger",
        id: "app.servers.errorFormFetch",
        values: {error, serverName: server.serverSettingName}
      });
      throw error;
    });
};

/**
 * fetchObject - fetches a single object from any Swagger API endpoint.
 *
 * @param {Server}   serverInstance  A Server instance
 * @param {string} [operationId=]  The Swagger operation id
 * @param {object} [parameters={}] Parameter passed with the call.
 *
 * @return {object} An object from the API call.
 */
export const fetchObject = async (
  serverInstance,
  operationId = "",
  parameters = {}
) => {
  const client = await serverInstance.getClient();
  try {
    const response = await client.execute({
      operationId,
      parameters
    });
    if (response.ok) {
      return response.body;
    }
    throw new Error(response);
  } catch (e) {
    if (e.name === "OperationNotFoundError" || e.status === 403) {
      // this is a permission issue, the operation is unavailable, hence not defined.
      // or it can be a 403.
      pluginRegistry.getHistory().push("/access-denied");
      return;
    }
    showMessage({
      type: "error",
      id: "app.common.mainError",
      values: {msg: e}
    });
    throw e;
  }
};

/**
 * fetchPageList - Fetches a single list page.
 *
 * @param {type} serverInstance A Server instance
 * @param {type} operationId    The Swagger
 * @param {type} parameters     Parameters passed to the call (page...)
 *
 * @return {object} A response body
 */
export const fetchPageList = async (
  serverInstance,
  operationId,
  parameters
) => {
  const client = await serverInstance.getClient();
  try {
    const response = await client.execute({
      operationId,
      parameters
    });
    if (response.ok) {
      return response.body;
    }
    throw new Error(response);
  } catch (e) {
    if (e.name === "OperationNotFoundError" || e.status === 403) {
      // this is a permission issue, the operation is unavailable, hence not defined.
      // or it can be a 403.
      pluginRegistry.getHistory().push("/access-denied");
      return;
    }
    showMessage({
      type: "error",
      id: "app.common.mainError",
      values: {msg: e}
    });
    throw e;
  }
};

/**
 * fetchListAll - Loops through all pages of a list and concats the result.
 *
 * @param {Server}   serverInstance  A Server Instance
 * @param {string} [operationId=]  Swagger operation id
 * @param {object} [parameters={}] Parameters passed to the call.
 * @param {array}  [results=[]]    The results, all objects for this API list.
 *
 * @return {type} Description
 */
export const fetchListAll = async (
  serverInstance,
  operationId = "",
  parameters = {},
  results = []
) => {
  return new Promise((resolve, reject) => {
    serverInstance
      .getClient()
      .then(client => {
        client
          .execute({
            operationId,
            parameters
          })
          .then(response => {
            if (response.ok) {
              if (Array.isArray(response.body)) {
                results = results.concat(response.body);
                resolve(results);
              } else if (response.body.results) {
                results = results.concat(response.body.results);
                // pagination in effect. Assuming page number navigation.
                if (response.body.next) {
                  const url = new URL(response.body.next);
                  const page = new URLSearchParams(url.search).get("page");
                  const subParameters = {...parameters, page};
                  fetchListAll(operationId, subParameters, results)
                    .then(resolve)
                    .catch(reject);
                } else {
                  resolve(results);
                }
              }
            } else {
              reject(response);
            }
          })
          .catch(e => {
            reject(e);
          });
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * deleteObject - Deletes an object.
 *
 * @param {string} [operationId=]  The operationId to execute.
 * @param {object} [parameters={}] Object data
 *
 * @return {object} response.
 */
export const deleteObject = async (
  serverInstance,
  operationId = "",
  parameters = {}
) => {
  const client = await serverInstance.getClient();
  const response = await client.execute({
    operationId,
    parameters
  });
  if (response.ok) {
    return response;
  }
};

export const fetchWithHeaders = async (serverInstance, path, req = {}) => {
  const body = req.body || null;
  let authedHeaders = await prepHeadersAuth(serverInstance, req.method);
  if (body) {
    authedHeaders.body = body;
  }
  return await fetch(path, {...authedHeaders});
};
