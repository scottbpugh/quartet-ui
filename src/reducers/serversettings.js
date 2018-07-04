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
import actions from "actions/serversettings";
import {showMessage} from "lib/message";
import uuidv4 from "uuid/v4";
import {pluginRegistry} from "plugins/pluginRegistration";
import {Server} from "lib/servers";

/**
 * initialData - Returns the initial data for
 * the Redux store for this form.
 * Used in index.js to initialized the store.
 *
 * It is a JSON-serializable object representing the form
 */
export const initialData = () => {
  let _initialData = {
    servers: {} // uuid key to objects
  };
  return _initialData;
};

export const saveServer = postData => {
  return dispatch => {
    showMessage({
      type: "success",
      id: "app.serverSettings.serverSettingsSaved"
    });
    let server = {...postData};
    server.plugins = [];
    server.plugins.push("number-range");
    if (!postData.serverID) {
      postData.serverID = uuidv4();
    }
    postData.hostname = postData.hostname.trim(); // prevent spaces.
    dispatch({type: actions.saveServerSettings, payload: postData});
    const newServer = new Server(postData);
    pluginRegistry.registerServer(newServer);
    newServer.listApps(); // refresh app list.
    return dispatch({
      type: actions.serverUpdated,
      payload: JSON.stringify(newServer)
    });
  };
};

export const deleteServer = server => {
  return dispatch => {
    pluginRegistry.removeServer(server);
    showMessage({type: "warning", id: "app.serverSettings.serverDeleted"});
    return dispatch({
      type: actions.deleteServer,
      payload: server.serverID
    });
  };
};

export default handleActions(
  {
    [actions.saveServerSettings]: (state, action) => {
      return {
        ...state,
        servers: {...state.servers, [action.payload.serverID]: action.payload},
        formData: initialData().formData
      };
    },
    [actions.appsListUpdated]: (state, action) => {
      return {
        ...state,
        servers: {...state.servers, [action.payload.serverID]: action.payload}
      };
    },
    [actions.deleteServer]: (state, action) => {
      let servers = {...state.servers};
      delete servers[action.payload]; // serverID
      return {
        ...state,
        servers: servers
      };
    },
    [actions.resetAppList]: (state, action) => {
      return {
        ...state,
        servers: {...state.servers, [action.payload.serverID]: action.payload}
      };
    }
  },
  {}
);
window.qu4rtet.exports("reducers/serversettings", this);

