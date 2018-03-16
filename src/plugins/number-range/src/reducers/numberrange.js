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

import {handleActions} from "redux-actions";
import actions from "../actions/pools";
import {
  getPools,
  getRegion,
  getRegions,
  allocate,
  deleteRegion,
  deletePool
} from "../lib/serialbox-api";
import {showMessage} from "lib/message";
import serverActions from "actions/serversettings";
import base64 from "base-64";
import {Parser} from "json2csv";
import jsonToXML from "jsontoxml";

export const initialData = () => ({
  servers: {},
  region: {},
  currentRegions: []
});

export const loadPools = server => {
  return dispatch => {
    getPools(server).then(pools => {
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
    getPools(server).then(pools => {
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
    });
  };
};

export const deleteARegion = (server, pool, region) => {
  return dispatch => {
    deleteRegion(server, region)
      .then(response => {
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
const generateFile = (server, pool, exportType, data) => {
  if (data.numbers && typeof data.numbers === "string") {
    // parse array of numbers.
    data.numbers = JSON.parse(data.numbers);
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
    let numberMap = data.numbers.map(number => {
      return {
        number: number
      };
    });
    data.numbers = numberMap;
    let xml = jsonToXML(data);
    encodedResult = base64.encode(
      `<?xml version="1.0" encoding="UTF-8"?><root>${xml}</root>`
    );
  }
  let link = document.createElement("a");
  link.download = `${pool.machine_name}-${data.region}-${
    data.size_granted
  }.${exportType}`;
  link.href = `data:application/octet-stream;charset=utf-8;content-disposition:attachment;base64,${encodedResult}`;
  link.click();
};
export const setAllocation = (server, pool, value, exportType) => {
  return dispatch => {
    allocate(server, pool, value).then(data => {
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
          if (data.size_granted) {
            generateFile(server, pool, exportType, data);
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
      return {
        ...state,
        allocationDetail: action.payload
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
