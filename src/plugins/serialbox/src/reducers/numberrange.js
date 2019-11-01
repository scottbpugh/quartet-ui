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

import {
  getPools,
  getRegion,
  getRegions,
  allocate,
  deleteRegion,
  deletePool
} from "../lib/serialbox-api";
import actions from "../actions/pools";
const {handleActions} = qu4rtet.require("redux-actions");
const {showMessage} = qu4rtet.require("./lib/message");
const serverActions = qu4rtet.require("./actions/serversettings");
const base64 = qu4rtet.require("base-64");
const {Parser} = qu4rtet.require("json2csv");
const jsonToXML = qu4rtet.require("jsontoxml");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

export const initialData = () => ({
  servers: {},
  region: {},
  currentRegions: []
});

const loadResponseRules = async (server, pools) => {
  try {
    let responseRules = await pluginRegistry
      .getServer(server.serverID)
      .fetchListAll("serialbox_response_rules_list", {}, []);
    // poor-man's matching alg.
    let poolsMap = {};
    pools.forEach(pool => {
      poolsMap[pool.id] = pool;
      pool.response_rules = [];
    });
    if (responseRules && responseRules.length > 0) {
      responseRules.forEach(responseRule => {
	try {
	  poolsMap[responseRule.pool].response_rules.push(responseRule);
	}
        catch (e) {
	  // ignore responseRule that don't have a pool set.
	  console.log("A response rule appears to not have a pool/rule assigned.");
	  console.log(e);
	}
      });
    }
    return Object.keys(poolsMap)
      .map(k => poolsMap[k])
      .sort(sortPools);
  } catch (e) {
    // Response Rules may not be implemented on server.
    console.log(e);
    return pools.sort(sortPools);
  }
};

const sortPools = (pool1, pool2) => {
  if (pool1.machine_name < pool2.machine_name) {
    return -1;
  }
  if (pool1.machine_name > pool2.machine_name) {
    return 1;
  }
  return 0;
};

export const loadPools = server => {
  return dispatch => {
    getPools(server).then(async pools => {
      // load response rules, if available.
      pools = await loadResponseRules(server, pools);
      dispatch({
        type: actions.loadPools,
        payload: {
          [server.serverID]: {pools: pools, server: server}
        }
      });
    });
  };
};

export const loadRegion = (server, regionName) => {
  return dispatch => {
    getRegion(server, regionName).then(region => {
      dispatch({
        type: actions.loadRegion,
        payload: region
      });
    });
  };
};

export const loadRegions = (server, pool) => {
  return dispatch => {
    // first get all pools again to refresh pool list.
    getPools(server)
      .then(async pools => {
        pools = await loadResponseRules(server, pools);
        dispatch({
          type: actions.loadPools,
          payload: {
            [server.serverID]: {pools: pools, server: server}
          }
        });

        // second get region for given pool (updated.)
        let updatedPool = pools.find(aPool => {
          return aPool.machine_name === pool.machine_name;
        });
        getRegions(server, updatedPool).then(regions => {
          dispatch({
            type: actions.loadRegions,
            payload: regions
          });
        });
      })
      .catch(e => {
        showMessage({type: "error", msg: e});
      });
  };
};

export const deleteARegion = (server, pool, region) => {
  return dispatch => {
    deleteRegion(server, region)
      .then(response => {
        if (!response.ok) {
          if (response.status === 403 || response.status === 401) {
            pluginRegistry.getHistory().push("/access-denied");
            return;
          } else {
            throw new Error(response);
          }
        }
        if (response.ok && response.status === 204) {
          dispatch(loadRegions(server, pool));
          showMessage({
            id: "plugins.numberRange.regionDeletedSuccessfully",
            type: "warning"
          });
        }
      })
      .catch(error => {
        showMessage({type: "error", msg: error.detail});
      });
  };
};

export const deleteAPool = (server, pool) => {
  return dispatch => {
    deletePool(server, pool)
      .then(response => {
        if (response.status === 403 || response.status === 401) {
          pluginRegistry.getHistory().push("/access-denied");
          return;
        }
        if (response.ok && response.status === 204) {
          dispatch(loadPools(server, pool));
          showMessage({type: "warning", msg: "Pool deleted successfully"});
        }
      })
      .catch(error => {
        showMessage({type: "error", msg: error.detail});
      });
  };
};

export const deleteResponseRule = (server, responseRule) => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .getClient()
      .then(client => {
        client.apis.serialbox
          .serialbox_response_rules_delete(responseRule)
          .then(result => {
            return dispatch(loadPools(server));
          })
          .catch(e => {
            showMessage({
              type: "error",
              msg: "An error occurred while attempting to delete response rule"
            });
          });
      });
  };
};

const generateFile = (server, pool, exportType, data, size) => {
  if (
    typeof data === "object" &&
    data.numbers &&
    typeof data.numbers === "string"
  ) {
    // parse array of numbers.
    data.numbers = JSON.parse(data.numbers.replace(/'/g, '"'));
  }
  let encodedResult = "";
  // download the result.
  if (exportType === "json") {
    encodedResult = base64.encode(JSON.stringify(data));
  } else if (exportType === "csv") {
    let csvParser = new Parser();
    let numberMap = data.numbers.map(number => {
      return {
        numbers: number
      };
    });
    const csv = csvParser.parse(numberMap);
    encodedResult = base64.encode(csv);
  } else if (exportType === "xml") {
    encodedResult = base64.encode(data);
  }
  let link = document.createElement("a");
  let regionName = data.region || 0;
  link.download = `${pool.machine_name}-${regionName}-${size}.${exportType}`;
  link.href = `data:application/octet-stream;charset=utf-8;content-disposition:attachment;base64,${encodedResult}`;
  link.click();
};
export const setAllocation = (server, pool, value, exportType) => {
  return dispatch => {
    allocate(server, pool, value, exportType).then(data => {
      if (typeof data === "object") {
        // let's take a look at the data.
        if (data.detail) {
          // looks like an error.
          showMessage({type: "error", msg: data.detail});
        } else if (data.fulfilled === true) {
          showMessage({
            id: "plugins.numberRange.allocatedSuccess",
            type: "success",
            values: {size: data.size_granted, regionName: data.region}
          });
        }
      } else {
        showMessage({
          id: "plugins.numberRange.allocatedSuccess",
          type: "success",
          values: {size: value, regionName: ""}
        });
      }
      dispatch({type: actions.allocate, payload: data});
      // reload regions.
      getRegions(server, pool).then(regions => {
        dispatch({
          type: actions.loadRegions,
          payload: regions
        });
      });
      setTimeout(() => {
        try {
          if (data.size_granted || typeof data === "string") {
            generateFile(server, pool, exportType, data, value);
          }
        } catch (error) {
          showMessage({
            id: "plugins.numberRange.errorFailedToGenerateFile",
            type: "danger"
          });
        }
      }, 500);
    });
  };
};

export default handleActions(
  {
    [actions.loadPools]: (state, action) => {
      return {
        ...state,
        servers: {
          ...state.servers,
          ...action.payload
        }
      };
    },
    [actions.loadRegion]: (state, action) => {
      return {
        ...state,
        region: action.payload
      };
    },
    [actions.loadRegions]: (state, action) => {
      return {
        ...state,
        currentRegions: action.payload
      };
    },
    [actions.allocate]: (state, action) => {
      // reload pools after
      //action.asyncDispatch(loadPools(action.payload));
      // don't pass allocation since it fails in redux.
      return {
        ...state
      };
    },

    [serverActions.serverUpdated]: (state, action) => {
      // we want to reload pools when new server is saved.
      /*action.asyncDispatch(
        loadPools(pluginRegistry.getServer(action.payload))
      );*/
      return {
        ...state
      };
    }
  },
  {}
);
