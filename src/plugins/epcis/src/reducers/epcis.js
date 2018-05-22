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
import actions from "../actions/epcis";
import {showMessage} from "lib/message";

export const initialData = () => {
  return {
    servers: {}
  };
};

export const loadEvent = (server, eventID) => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchObject("epcis_event_detail_read", {event_id: eventID})
      .then(event => {
        return dispatch({
          type: actions.loadItemDetail,
          payload: {
            serverID: server.serverID,
            itemID: eventID,
            itemDetail: event
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.epcis.errorLoadingEvent",
          values: {error: e}
        });
      });
  };
};

export const loadEntry = (server, entryID) => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchObject("epcis_events_by_entry_id_read", {entry_identifier: entryID})
      .then(entry => {
        return dispatch({
          type: actions.loadItemDetail,
          payload: {
            serverID: server.serverID,
            itemID: entryID,
            itemDetail: entry
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.epcis.errorLoadingEntry",
          values: {error: e}
        });
      });
  };
};

export const loadEntries = (server, search, page, ordering) => {
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
      .fetchPageList("epcis_entries_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadEntries,
          payload: {
            serverID: server.serverID,
            entries: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.epcis.errorLoadingEvents",
          values: {error: e}
        });
      });
  };
};

export const loadEvents = (server, type, search, page, ordering) => {
  let params = {};
  if (type) {
    params.type = type;
  }
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
      .fetchPageList("epcis_events_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadEvents,
          payload: {
            serverID: server.serverID,
            events: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.epcis.errorLoadingEvents",
          values: {error: e}
        });
      });
  };
};

export default handleActions(
  {
    [actions.loadEntries]: (state, action) => {
      if (!state.servers) {
        state.servers = {};
      }
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.serverID]: {
            ...state.servers[action.payload.serverID],
            entries: action.payload.entries,
            count: action.payload.count,
            next: action.payload.next
          }
        }
      };
    },
    [actions.loadEvents]: (state, action) => {
      if (!state.servers) {
        state.servers = {};
      }
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.serverID]: {
            ...state.servers[action.payload.serverID],
            events: action.payload.events,
            count: action.payload.count,
            next: action.payload.next
          }
        }
      };
    },
    [actions.loadItemDetail]: (state, action) => {
      if (!state.servers) {
        state.servers = {};
      }
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.serverID]: {
            ...state.servers[action.payload.serverID],
            detailItems: {
              ...state.servers[action.payload.serverID].detailItems,
              [action.payload.itemID]: action.payload.itemDetail
            }
          }
        }
      };
    }
  },
  {}
);