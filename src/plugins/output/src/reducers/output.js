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
import actions from "../actions/output";
const {handleActions} = qu4rtet.require("redux-actions");
const {setServerState} = qu4rtet.require("./lib/reducer-helper");
const {showMessage} = qu4rtet.require("./lib/message");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

export const initialData = () => {
  return {
    servers: {}
  };
};

const setupParams = (search, page, ordering) => {
  const params = {};
  if (search) {
    params.search = search;
  }
  if (page) {
    params.page = page;
  }
  if (ordering) {
    params.ordering = ordering;
  }
  return params;
};

export const loadAuthenticationList = (server, search, page, ordering) => {
  const params = setupParams(search, page, ordering);
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("output_authentication_info_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadAuthenticationList,
          payload: {
            serverID: server.serverID,
            authenticationList: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.output.errorLoadingAuthenticationList",
          values: {error: e}
        });
      });
  };
};

export const loadEndpoints = (server, search, page, ordering) => {
  const params = setupParams(search, page, ordering);
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("output_end_points_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadEndpoints,
          payload: {
            serverID: server.serverID,
            endpoints: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.output.errorLoadingEndpoints",
          values: {error: e}
        });
      });
  };
};

export const loadEPCISCriteria = (server, search, page, ordering) => {
  const params = setupParams(search, page, ordering);
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("output_read_only_epcis_output_criteria_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadEPCISOutputCriteria,
          payload: {
            serverID: server.serverID,
            criteria: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.output.errorLoadingCriteria",
          values: {error: e}
        });
      });
  };
};

export default handleActions(
  {
    [actions.loadAuthenticationList]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        authenticationList: action.payload.authenticationList,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadEndpoints]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        endpoints: action.payload.endpoints,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadEPCISOutputCriteria]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        criteria: action.payload.criteria,
        count: action.payload.count,
        next: action.payload.next
      });
    }
  },
  {}
);
