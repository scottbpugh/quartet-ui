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

import {handleActions} from "redux-actions";
import actions from "../actions/pools";
import {getPools, getRegion, getRegions, allocate} from "../lib/serialbox-api";

export const initialData = () => ({
  servers: {},
  region: {},
  currentRegions: []
});

export const loadPools = server => {
  return dispatch => {
    getPools(server).then(pools =>
      dispatch({
        type: actions.loadPools,
        payload: {
          [server.serverID]: {pools: pools, server: server}
        }
      })
    );
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
    getRegions(server, pool).then(regions => {
      dispatch({
        type: actions.loadRegions,
        payload: regions
      });
    });
  };
};

export const allocate = (server, pool, value) => {
  return dispatch => {
    allocate(server, pool, value).then(resp => {
      dispatch({type: actions.allocate});
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
    }
  },
  {}
);
