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
import actions from "../actions/users";
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

export const loadUsers = (server, search, page, ordering) => {
  const params = setupParams(search, page, ordering);
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("read_only_users_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadUsers,
          payload: {
            serverID: server.serverID,
            users: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.users.errorLoadingUsers",
          values: {error: e}
        });
      });
  };
};

export const loadGroups = (server, search, page, ordering) => {
  const params = setupParams(search, page, ordering);
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("read_only_groups_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadGroups,
          payload: {
            serverID: server.serverID,
            groups: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.users.errorLoadingGroups",
          values: {error: e}
        });
      });
  };
};

export const loadPermissions = (server, search, page, ordering) => {
  const params = setupParams(search, page, ordering);
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("permission_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadPermissions,
          payload: {
            serverID: server.serverID,
            permissions: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.users.errorLoadingPermissions",
          values: {error: e}
        });
      });
  };
};

export default handleActions(
  {
    [actions.loadUsers]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        users: action.payload.users,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadGroups]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        groups: action.payload.groups,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [actions.loadPermissions]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        permissions: action.payload.permissions,
        count: action.payload.count,
        next: action.payload.next
      });
    }
  },
  {}
);
