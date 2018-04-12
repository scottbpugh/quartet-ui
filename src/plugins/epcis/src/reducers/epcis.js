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

export const initialData = () => {
  return {
    servers: {}
  };
};

export const loadEntries = server => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .getClient()
      .then(client => {
        client.apis.epcis.epcis_entries_list().then(result => {
          return dispatch({
            type: actions.loadEntries,
            payload: {
              serverID: server.serverID,
              entries: result.body
            }
          });
        });
      });
  };
};

export const loadEvents = server => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .getClient()
      .then(client => {
        client.apis.epcis.epcis_events_list().then(result => {
          return dispatch({
            type: actions.loadEvents,
            payload: {
              serverID: server.serverID,
              events: result.body
            }
          });
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
            entries: action.payload.entries
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
            events: action.payload.events
          }
        }
      };
    }
  },
  {}
);
