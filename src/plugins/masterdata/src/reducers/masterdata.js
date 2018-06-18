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
import {pluginRegistry} from "plugins/pluginRegistration";
import actions from "../actions/masterdata";
import {showMessage} from "lib/message";

export const initialData = () => {
  return {
    servers: {}
  };
};

export const loadLocations = (server, search, page, ordering) => {
  let params = {};
  if (search) {
    params.search = search;
  }
  if (page) {
    params.page = page;
  }
  if (ordering) {
    params.ordering = ordering;
  }
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("masterdata_locations_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadLocations,
          payload: {
            serverID: server.serverID,
            locations: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.masterData.errorLoadingLocations",
          values: {error: e}
        });
      });
  };
};

export const loadCompanies = (server, search, page, ordering) => {
  let params = {};
  if (search) {
    params.search = search;
  }
  if (page) {
    params.page = page;
  }
  if (ordering) {
    params.ordering = ordering;
  }
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("masterdata_companies_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadCompanies,
          payload: {
            serverID: server.serverID,
            companies: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.masterData.errorLoadingCompanies",
          values: {error: e}
        });
      });
  };
};

export const loadTradeItems = (server, search, page, ordering) => {
  let params = {};
  if (search) {
    params.search = search;
  }
  if (page) {
    params.page = page;
  }
  if (ordering) {
    params.ordering = ordering;
  }
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("masterdata_trade_items_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadTradeItems,
          payload: {
            serverID: server.serverID,
            tradeItems: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.masterData.errorLoadingTradeItems",
          values: {error: e}
        });
      });
  };
};

export const loadLocationTypes = (server, search, page, ordering) => {
  let params = {};
  if (search) {
    params.search = search;
  }
  if (page) {
    params.page = page;
  }
  if (ordering) {
    params.ordering = ordering;
  }
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("masterdata_location_types_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadLocationTypes,
          payload: {
            serverID: server.serverID,
            locationTypes: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.masterData.errorLoadingLocationTypes",
          values: {error: e}
        });
      });
  };
};

export const deleteTradeItemField = (server, field) => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .getClient()
      .then(client => {
        client.apis.masterdata
          .masterdata_trade_item_fields_delete(field)
          .then(result => {
            return dispatch(loadTradeItems(server));
          });
      });
  };
};

export default handleActions(
  {
    [actions.loadLocations]: (state, action) => {
      if (!state.servers) {
        state.servers = {};
      }
      return {
        ...state,
        servers: {
          [action.payload.serverID]: {
            ...state.servers[action.payload.serverID],
            locations: action.payload.locations,
            count: action.payload.count,
            next: action.payload.next
          }
        }
      };
    },
    [actions.loadLocationTypes]: (state, action) => {
      if (!state.servers) {
        state.servers = {};
      }
      return {
        ...state,
        servers: {
          [action.payload.serverID]: {
            ...state.servers[action.payload.serverID],
            locationTypes: action.payload.locationTypes,
            count: action.payload.count,
            next: action.payload.next
          }
        }
      };
    },
    [actions.loadCompanies]: (state, action) => {
      if (!state.servers) {
        state.servers = {};
      }
      return {
        ...state,
        servers: {
          [action.payload.serverID]: {
            ...state.servers[action.payload.serverID],
            companies: action.payload.companies,
            count: action.payload.count,
            next: action.payload.next
          }
        }
      };
    },
    [actions.loadTradeItems]: (state, action) => {
      if (!state.servers) {
        state.servers = {};
      }
      return {
        ...state,
        servers: {
          [action.payload.serverID]: {
            ...state.servers[action.payload.serverID],
            tradeItems: action.payload.tradeItems,
            count: action.payload.count,
            next: action.payload.next
          }
        }
      };
    }
  },
  {}
);
