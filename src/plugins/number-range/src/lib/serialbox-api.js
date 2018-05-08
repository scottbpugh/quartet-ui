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
import {prepHeadersAuth} from "lib/auth-api";
import {pluginRegistry} from "plugins/pluginRegistration";
const PREFIX_PATH = "serialbox/";

/**
 * getPools - Description
 *
 * @param {object} server A serversetting object.
 *
 * @return {object} A JSON object.
 */
export const getPools = server => {
  return pluginRegistry
    .getServer(server.serverID)
    .fetchListAll("serialbox_pools_list", {related: "true"}, [])
    .then(pools => {
      return pools;
    })
    .catch(error => {
      showMessage({
        type: "danger",
        id: "plugins.numberRange.errorFetchPools",
        values: {serverName: server.serverSettingName}
      });
      return error;
    });
};

export const getPoolDetail = (server, pool) => {
  const url = `${server.url}${PREFIX_PATH}pool-detail/${
    pool.machine_name
  }/?related=true`;
  return fetch(url, prepHeadersAuth(server))
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      showMessage({
        type: "danger",
        id: "plugins.numberRange.errorFetchPool",
        values: {poolName: pool.readable_name, error: error}
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
  return getRegionByName(
    server,
    regionName,
    "serialbox_sequential_region_detail_read"
  );
};

/**
 * getRegionByName - Similar to getRegion but no URL logic.
 *
 * @param {object} server Server setting object.
 * @param {string} url The name of the region.
 * @param {string} operationId the operationId for the endpoint.
 *
 * @return {object} A JSON object.
 */
export const getRegionByName = (server, name, operationId) => {
  return pluginRegistry
    .getServer(server.serverID)
    .fetchObject(operationId, {machine_name: name})
    .then(detail => {
      return detail;
    })
    .catch(error => {
      showMessage({
        type: "danger",
        id: "plugins.numberRange.errorFetchRegion",
        values: {error: error}
      });
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
  for (let name of pool.sequentialregion_set) {
    promises.push(
      getRegionByName(server, name, "serialbox_sequential_region_detail_read")
    );
  }
  if (pool.randomizedregion_set) {
    for (let name of pool.randomizedregion_set) {
      promises.push(
        getRegionByName(server, name, "serialbox_randomized_regions_read")
      );
    }
  }
  return Promise.all(promises)
    .then(data => {
      return data;
    })
    .catch(error => {
      showMessage({
        type: "danger",
        id: "plugins.numberRange.errorFetchRegion",
        values: {error: error}
      });
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
    `${server.url}${PREFIX_PATH}allocate/${pool.machine_name}/${value}/`,
    prepHeadersAuth(server)
  )
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      showMessage({
        type: "danger",
        id: "plugins.numberRange.errorAllocating",
        values: {error: error, poolName: pool.readable_name}
      });
      throw error;
    });
};

export const postAddRegion = (server, postValues, edit = false) => {
  let method = "POST";
  let endpoint = "sequential-region-create";
  if (edit) {
    method = "PUT";
    endpoint = `sequential-region-modify/${postValues.machine_name}`;
  }
  let headers = prepHeadersAuth(server, method);
  headers.body = JSON.stringify(postValues);
  return fetch(`${server.url}${PREFIX_PATH}${endpoint}/`, headers)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      showMessage({
        type: "error",
        id: "plugins.numberRange.errorVanilla",
        values: {error: error}
      });
    });
};

export const postAddRandomizedRegion = (server, postValues, edit = false) => {
  let method = "POST";
  let endpoint = "randomized-regions";
  if (edit) {
    method = "PUT";
    endpoint = `randomized-regions/${postValues.machine_name}`;
  }
  let headers = prepHeadersAuth(server, method);
  headers.body = JSON.stringify(postValues);
  return fetch(`${server.url}${PREFIX_PATH}${endpoint}/`, headers)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      showMessage({
        type: "error",
        id: "plugins.numberRange.errorVanilla",
        values: {error: error}
      });
      throw error;
    });
};

export const deleteRegion = (server, region) => {
  let method = "DELETE";
  let endpoint = "";
  if (region.state) {
    // sequential
    endpoint = `sequential-region-modify/${region.machine_name}`;
  } else if (region.remaining || region.remaining === 0) {
    // randomized
    endpoint = `randomized-regions/${region.machine_name}`;
  }
  let headers = prepHeadersAuth(server, method);
  //headers.body = JSON.stringify(postValues);
  return fetch(`${server.url}${PREFIX_PATH}${endpoint}/`, headers)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      showMessage({
        type: "error",
        id: "plugins.numberRange.errorVanilla",
        values: {error: error}
      });
      throw error;
    });
};

export const deletePool = (server, pool) => {
  let method = "DELETE";
  let endpoint = `pool-modify/${pool.machine_name}`;
  let headers = prepHeadersAuth(server, method);
  //headers.body = JSON.stringify(postValues);
  return fetch(`${server.url}${PREFIX_PATH}${endpoint}/`, headers)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      showMessage({
        type: "error",
        id: "plugins.numberRange.errorVanilla",
        values: {error: error}
      });
      throw error;
    });
};

export const postAddPool = (server, postValues, edit = false) => {
  let endpoint = "pool-create";
  let method = "POST";
  if (edit) {
    method = "PUT";
    endpoint = `pool-modify/${postValues.machine_name}`;

    try {
      // remove sets before submitting.
      delete postValues.sequentialregion_set;
      delete postValues.randomizedregion_set;
    } catch (e) {
      console.log(e);
    }
  }
  let headers = prepHeadersAuth(server, method);
  headers.body = JSON.stringify(postValues);
  return fetch(`${server.url}${PREFIX_PATH}${endpoint}/`, headers)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      showMessage({
        type: "error",
        id: "plugins.numberRange.errorVanilla",
        values: {error: error}
      });
      throw error;
    });
};
