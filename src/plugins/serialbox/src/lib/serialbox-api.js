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
const {showMessage} = qu4rtet.require("./lib/message");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

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
export const getRegionByName = async (server, name, operationId) => {
  try {
    let res = await pluginRegistry
      .getServer(server.serverID)
      .fetchObject(operationId, {machine_name: name});
    return res;
  } catch (error) {
    showMessage({
      type: "danger",
      id: "plugins.numberRange.errorFetchRegion",
      values: {error: error}
    });
    return error;
  }
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

  if (pool.listbasedregion_set) {
    for (let name of pool.listbasedregion_set) {
      promises.push(
        getRegionByName(server, name, "serialbox_list_based_region_detail_read")
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


const prepHeadersAuth = async (
  server,
  method = "GET",
  contentType = "application/json",
  accept = "application/json"
) => {
  const headers = new Headers();
  headers.append("Accept", accept);
  if (contentType) {
    headers.append("Content-Type", contentType);
  }
  headers.append(
    "Authorization",
    await pluginRegistry.getServer(server.serverID).getAuthorization()
  );
  console.log("headers", JSON.stringify(headers));
  return {
    method,
    headers,
    mode: "cors"
  };
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
export const allocate = async (server, pool, value, exportType) => {

  try {
    if (exportType === "xml") {
      // Requesting XML as is.
      let headers = await prepHeadersAuth(server, "GET", "application/xml", "application/xml");
      let response = await fetch(`${server.url}serialbox/allocate/${pool.machine_name}/${value}/`, {...headers});
      let raw = await response.text();      
      if (!response.ok) {
	throw new Error(raw.substring(0,250))
      }
      return raw;
    } else {
      return await pluginRegistry
	.getServer(server.serverID)
	.fetchObject("serialbox_allocate_read", {
          pool: pool.machine_name,
          size: value
	});
    }
  } catch (error) {
    if (error.response && error.response.obj && error.response.obj.detail) {
      showMessage({
        type: "danger",
        msg: error.response.obj.detail
      });
    } else {
      showMessage({
        type: "danger",
        id: "plugins.numberRange.errorAllocating",
        values: {error: error, poolName: pool.readable_name}
      });
    }
    return error;
  }
};

export const postAddRegion = async (server, postValues, edit = false) => {
  let method = "POST";
  let endpoint = "sequential-region-create";
  if (edit) {
    method = "PUT";
    endpoint = `sequential-region-modify/${postValues.machine_name}`;
  }
  let req = {method: method};
  req.body = JSON.stringify(postValues);
  return await pluginRegistry
    .getServer(server.serverID)
    .fetchWithHeaders(`${server.url}${PREFIX_PATH}${endpoint}/`, req)
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

export const postAddRandomizedRegion = async (
  server,
  postValues,
  edit = false
) => {
  let method = "POST";
  let endpoint = "randomized-regions";
  if (edit) {
    method = "PUT";
    endpoint = `randomized-regions/${postValues.machine_name}`;
  }
  let req = {method: method};
  req.body = JSON.stringify(postValues);
  return await pluginRegistry
    .getServer(server.serverID)
    .fetchWithHeaders(`${server.url}${PREFIX_PATH}${endpoint}/`, req)
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
const getRegionType = region => {
  if (region.state) {
    return "serial";
  }
  if (!region.state && region.max) {
    return "randomized";
  }
  if (region.processing_class_path !== undefined) {
    return "list-based";
  }
  return null;
};

export const deleteRegion = async (server, region) => {
  let method = "DELETE";
  let endpoint = "";
  let regionType = getRegionType(region);
  if (regionType === "serial") {
    // sequential
    endpoint = `sequential-region-modify/${region.machine_name}`;
  } else if (regionType === "randomized") {
    // randomized
    endpoint = `randomized-regions/${region.machine_name}`;
  } else if (regionType === "list-based") {
    endpoint = `list-based-region-modify/${region.machine_name}`;
  }
  let req = {method: method};
  return await pluginRegistry
    .getServer(server.serverID)
    .fetchWithHeaders(`${server.url}${PREFIX_PATH}${endpoint}/`, req)
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

export const deletePool = async (server, pool) => {
  let method = "DELETE";
  let endpoint = `pool-modify/${pool.machine_name}`;
  let req = {method: method};

  return await pluginRegistry
    .getServer(server.serverID)
    .fetchWithHeaders(`${server.url}${PREFIX_PATH}${endpoint}/`, req)
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

export const postAddPool = async (server, postValues, edit = false) => {
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
  let req = {method: method};
  req.body = JSON.stringify(postValues);
  return await pluginRegistry
    .getServer(server.serverID)
    .fetchWithHeaders(`${server.url}${PREFIX_PATH}${endpoint}/`, req)
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
