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
  return {
    navTreeItems: [],
    plugins: {
      "quartet-ui-number-range": {
        core: true,
        preview: "",
        initPath: "lib/init.js",
        readableName: "Serial Number Range Management",
        pluginName: "quartet-ui-number-range",
        packagePath: "quartet-ui-number-range",
        version: "1.0.0",
        description:
          "\n                The Serial Number Range Management plugin offers users the\n                ability to interact with SerialBox, the backend solution for\n                your serial number range management requirements.\n\n                Among other functions, this plugin offers the ability to create\n                pools and serial number ranges as well as allocate numbers on\n                the fly from the QU4RTET interface.\n            ",
        enabled: true
      },
      Capture: {
        core: true,
        initPath: "capture/src/init.js",
        preview: "",
        readableName: "Capture",
        pluginName: "Capture",
        description:
          "\n              The Capture Plugin allows interaction with the backend QU4RTET Capture interface. The QU4RTET Capture app enables the “capture” and subsequent processing of messages through a primitive processing engine that allows developers to customize how messages get processed. The capture application also contains a standard EPCIS capture interface implementation as well.\n            ",
        enabled: true
      },
      epcis: {
        core: true,
        initPath: "epcis/src/init.js",
        preview: "",
        readableName: "EPCIS",
        pluginName: "EPCIS",
        description:
          "\n              The EPCIS Plugin allows interaction with the backend QU4RTET EPCIS interface. QU4RTET EPCIS is the EPCIS XML Parsing for the Quartet Platform\n            ",
        enabled: true
      },
      MasterData: {
        core: true,
        initPath: "masterdata/src/init.js",
        preview: "",
        readableName: "Master Data",
        pluginName: "MasterData",
        description:
          "\n              The interface plugin to handle material, lot and location master data.\n            ",
        enabled: true
      }
    },
    pluginsUpdated: false
  };
};

export const setEnablePlugin = pluginEntries => {
  return dispatch => {
    for (let plugin in pluginEntries) {
      pluginEntries[plugin].enabled = true;
    }
    showMessage({type: "success", id: "app.plugins.pluginEnabled"});
    return dispatch({type: actions.pluginEnabled, payload: pluginEntries});
  };
};

export const setDisablePlugin = pluginEntries => {
  return dispatch => {
    for (let plugin in pluginEntries) {
      pluginEntries[plugin].enabled = false;
    }
    showMessage({type: "success", id: "app.plugins.pluginDisabled"});
    return dispatch({type: actions.pluginDisabled, payload: pluginEntries});
  };
};

export const fetchRemotePlugins = () => {
  return async dispatch => {
    try {
      let pluginRequire = window
        .require("electron")
        .remote.require("./main-process/plugin-manager.js");
      let pluginList = require(require("path").join(
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
      let navTreeItems = {...state.navTreeItems};
      delete navTreeItems[action.payload.pluginComponentName];
      return {
        ...state,
        navTreeItems: navTreeItems
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
      let newState = {...state};
      Object.keys(state.plugins).forEach(pluginName => {
        // remove legacy.
        if (pluginName == "Number Range") {
          delete newState.plugins["NumberRange"];
        }
        if (action.payload[pluginName]) {
          action.payload[pluginName].enabled =
            state.plugins[pluginName].enabled;
        }
      });
      return {
        ...state,
        plugins: {...newState.plugins, ...action.payload},
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
    [actions.pluginListUpdated]: state => {
      return {
        ...state,
        pluginListUpdated: true
      };
    }
  },
  {}
);
window.qu4rtet.exports("reducers/plugins", this);
