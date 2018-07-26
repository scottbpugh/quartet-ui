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
import {showMessage} from "lib/message";
import {setServerState} from "lib/reducer-helper";
import actions from "../actions/masterdata";

export const initialData = () => {
  return {
    servers: {}
  };
};

// used to load all companies initially and cache them.
let companiesMap = {};

const setCompaniesForLocations = async (serverObject, locations) => {
  if (!companiesMap[serverObject.serverID]) {
    // initialize cache object for companies.
    companiesMap[serverObject.serverID] = {};
  }
  try {
    if (Object.keys(companiesMap[serverObject.serverID]).length === 0) {
      // load companies so we can have a match in the list.
      let _companiesArray = await serverObject.fetchListAll(
        "masterdata_companies_list",
        {},
        []
      );
      _companiesArray.forEach(company => {
        companiesMap[serverObject.serverID][company.id] = company;
      });
    }
    locations.forEach(location => {
      if (
        location.company &&
        companiesMap[serverObject.serverID][location.company]
      ) {
        location.companyObject =
          companiesMap[serverObject.serverID][location.company];
      }
    });
  } catch (e) {
    // proceed without companies.
    console.log(e);
  }
};

export const loadLocations = (server, search, page, ordering) => {
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
  return async dispatch => {
    let serverObject = pluginRegistry.getServer(server.serverID);
    serverObject
      .fetchPageList("masterdata_locations_list", params, [])
      .then(async response => {
        await setCompaniesForLocations(serverObject, response.results);
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
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("masterdata_companies_list", params, [])
      .then(response => {
        // update company cache based on latest fetch.
        response.results.forEach(company => {
          if (!companiesMap[server.serverID]) {
            companiesMap[server.serverID] = {};
          }
          companiesMap[server.serverID][company.id] = company;
        });
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

export const loadCompanyTypes = (server, search, page, ordering) => {
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
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("masterdata_company_types_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadCompanyTypes,
          payload: {
            serverID: server.serverID,
            companyTypes: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.masterData.errorLoadingCompanyTypes",
          values: {error: e}
        });
      });
  };
};

export const loadLocationDetail = (server, identifier) => {
  return async dispatch => {
    const params = {identifier};
    try {
      const location = await pluginRegistry
        .getServer(server)
        .fetchPageList("masterdata_location_by_identifier_read", params);
      return dispatch({
        type: actions.loadLocationDetail,
        payload: {
          serverID: server.serverID,
          locationDetail: {identifier, detail: location}
        }
      });
    } catch (e) {
      return dispatch({
        type: actions.loadLocationDetail,
        payload: {
          serverID: server.serverID,
          locationDetail: {identifier, error: e}
        }
      });
    }
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
      return setServerState(state, action.payload.serverID, {
        locations: action.payload.locations,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadLocationTypes]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        locationTypes: action.payload.locationTypes,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadCompanyTypes]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        companyTypes: action.payload.companyTypes,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadAllCompanyTypes]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        allLocationTypes: action.payload.allLocationTypes,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadAllLocationTypes]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        allCompanyTypes: action.payload.allCompanyTypes,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadCompanies]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        companies: action.payload.companies,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadTradeItems]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        tradeItems: action.payload.tradeItems,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadLocationDetail]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        locationDetail: action.payload.locationDetail
      });
    }
  },
  {}
);
