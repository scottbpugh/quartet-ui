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
import {prepServerURL} from "lib/servers";

/**
 * prepHeaders - Prepares the headers to be sent.
 *
 * @param {object} server A server setting object
 *
 * @return {object} A request init object with headers.
 */
const prepHeaders = (server, method = "GET") => {
  let username = server.username;
  let password = server.password;
  let headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");
  headers.append(
    "Authorization",
    "Basic " + base64.encode(username + ":" + password)
  );
  return {
    method: method,
    headers: headers,
    credentials: "include",
    mode: "cors"
  };
};

/**
 * getPools - Description
 *
 * @param {object} server A serversetting object.
 *
 * @return {object} A JSON object.
 */
export const getPools = server => {
  const url = `${prepServerURL(server)}pools/?related=true`;
  return fetch(url, prepHeaders(server))
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      showMessage({
        type: "danger",
        msg: `An error occurred while attempting to fetch pools from ${
          server.serverSettingName
        }`
      });
      return error;
    });
};

/**
 * getRegion - Description
 *
 * @param {object} server   A serversetting Object
 * @param {string} regionName A region machine name
 *
 * @return {object} A JSON response.
 */
export const getRegion = (server, regionName) => {
  return getRegionByURL(
    server,
    `${prepServerURL(server)}sequential-region-detail/${regionName}/`
  );
};

/**
 * getRegionByURL - Similar to getRegion but no URL logic.
 *
 * @param {object} server Server setting object.
 * @param {string} url A full URL to the API endpoint.
 *
 * @return {object} A JSON object.
 */
export const getRegionByURL = (server, url) => {
  return fetch(url, prepHeaders(server))
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

/**
 * getRegions - Description
 *
 * @param {object} server Server setting object.
 * @param {object} pool   Pool object
 *
 * @return {Promise} A promise
 */
export const getRegions = (server, pool) => {
  let promises = [];
  for (let url of pool.sequentialregion_set) {
    promises.push(getRegionByURL(server, url));
  }
  return Promise.all(promises)
    .then(data => {
      return data;
    })
    .catch(error => {
      return error;
    });
};

/**
 * allocate - Allocates numbers to pool
 *
 * @param {object} server A server setting object
 * @param {object} pool   A pool object
 * @param {integer} value  A numeric value.
 *
 * @return {object} A JSON response.
 */
export const allocate = (server, pool, value) => {
  return fetch(
    `${prepServerURL(server)}allocate/${pool.machine_name}/${value}/`
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

export const getRegionFormStructure = server => {
  return fetch(
    `${prepServerURL(server)}sequential-region-create/`,
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

export const getPoolFormStructure = server => {
  return fetch(
    `${prepServerURL(server)}pool-create/`,
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

export const postAddRegion = (server, postValues) => {
  let headers = prepHeaders(server, "POST");
  headers.body = JSON.stringify(postValues);
  return fetch(
    `${prepServerURL(server)}sequential-region-create/`,
    headers
  ).then(resp => {
    return resp;
  });
};

export const postAddPool = (server, postValues) => {
  let headers = prepHeaders(server, "POST");
  headers.body = JSON.stringify(postValues);
  return fetch(`${prepServerURL(server)}pool-create/`, headers).then(resp => {
    return resp;
  });
};
