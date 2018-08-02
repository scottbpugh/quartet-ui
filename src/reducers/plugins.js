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
import actions from "actions/plugins";
import {showMessage} from "lib/message";

export const initialData = () => {
  // load the plugins list when there is nothing in the local storage.
  const pluginList = require(require("path").join(
    window.qu4rtet.userData,
    "pluginList.json"
  ));
  console.log("pluginList", pluginList);
  return {
    navTreeItems: [],
    plugins: {...pluginList},
    pluginListUpdated: false
  };
};

export const setEnablePlugin = (pluginEntries, showToast = true) => {
  return dispatch => {
    for (const plugin in pluginEntries) {
      pluginEntries[plugin].enabled = true;
    }
    if (showToast) {
      showMessage({type: "success", id: "app.plugins.pluginEnabled"});
    }
    return dispatch({type: actions.pluginEnabled, payload: pluginEntries});
  };
};

export const setDisablePlugin = pluginEntries => {
  return dispatch => {
    for (const plugin in pluginEntries) {
      pluginEntries[plugin].enabled = false;
    }
    showMessage({type: "success", id: "app.plugins.pluginDisabled"});
    return dispatch({type: actions.pluginDisabled, payload: pluginEntries});
  };
};

export const fetchRemotePlugins = () => {
  return async dispatch => {
    try {
      const pluginRequire = window
        .require("electron")
        .remote.require("./main-process/plugin-manager.js");
      const pluginList = require(require("path").join(
        window.qu4rtet.userData,
        "pluginList.json"
      )); // loads the module
      return dispatch({
        type: actions.receivedPluginsData,
        payload: pluginList
      });
    } catch (e) {
      showMessage({
        type: "error",
        id: "app.plugins.errorFetchRemotePlugins",
        values: {error: e}
      });
    }
  };
};

export const addLocalPlugin = localPlugin => {
  return dispatch => {
    return dispatch({
      type: actions.addLocalPlugin,
      payload: {[localPlugin.pluginName]: {...localPlugin}}
    });
  };
};

export default handleActions(
  {
    [actions.resetPlugins]: (state, action) => {
      return {
        ...state,
        plugins: {...action.payload}
      };
    },
    [actions.addToTreeServers]: (state, action) => {
      return {
        ...state,
        navTreeItems: {
          ...state.navTreeItems,
          [action.payload.pluginComponentName]: {...action.payload}
        }
      };
    },
    [actions.removeFromTreeServers]: (state, action) => {
      const navTreeItems = {...state.navTreeItems};
      delete navTreeItems[action.payload.pluginComponentName];
      return {
        ...state,
        navTreeItems
      };
    },
    [actions.addButtonToControls]: (state, action) => {
      return {
        ...state,
        controlButtons: {
          ...state.controlButtons,
          [action.payload.pluginComponentName]: {...action.payload}
        }
      };
    },
    [actions.removeButtonFromControls]: (state, action) => {
      const controlButtons = {...state.controlButtons};
      delete controlButtons[action.payload.pluginComponentName];
      return {
        ...state,
        controlButtons
      };
    },
    [actions.pluginEnabled]: (state, action) => {
      return {
        ...state,
        plugins: {...state.plugins, ...action.payload}
      };
    },
    [actions.pluginDisabled]: (state, action) => {
      return {
        ...state,
        plugins: {...state.plugins, ...action.payload}
      };
    },
    [actions.receivedPluginsData]: (state, action) => {
      // preserve enabled/disabled settings.
      Object.keys(state.plugins).forEach(pluginName => {
        // remove legacy.
        if (action.payload[pluginName]) {
          action.payload[pluginName].enabled =
            state.plugins[pluginName].enabled;
        }
      });

      return {
        ...state,
        plugins: {...state.plugins, ...action.payload},
        remotePluginList: {...action.payload}
      };
    },
    [actions.addLocalPlugin]: (state, action) => {
      return {
        ...state,
        plugins: {...state.plugins, ...action.payload}
      };
    },
    [actions.pluginsActivated]: (state, action) => {
      return {
        ...state,
        navTreeItems: {...state.navTreeItems}
      };
    },
    [actions.pluginListUpdated]: (state, action) => {
      return {
        ...state,
        pluginListUpdated: action.payload
      };
    }
  },
  {}
);
window.qu4rtet.exports("reducers/plugins", this);
