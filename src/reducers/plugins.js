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
import actions from "actions/plugins";
import {registerComponent} from "plugins/pluginRegistration";
import {showMessage} from "lib/message";

export const initialData = () => {
  return {
    navTreeItems: [],
    plugins: {
      NumberRange: {
        core: true,
        enabled: false,
        preview: "/plugin-screenshots/number-range.png",
        initPath: "number-range/src/init.js",
        readableName: "Serial Number Range Management",
        pluginName: "NumberRange",
        description: `
                The Serial Number Range Management plugin offers users the
                ability to interact with SerialBox, the backend solution for
                your serial number range management requirements.

                Among other things, this plugin offers the ability to create
                pools and serial number ranges as well as allocate numbers on
                the fly from the QU4RTET interface.
            `
      }
    }
  };
};

export const setEnablePlugin = pluginEntries => {
  return dispatch => {
    for (let plugin in pluginEntries) {
      pluginEntries[plugin].enabled = true;
    }
    showMessage({type: "success", msg: `Plugin enabled.`});
    return dispatch({type: actions.pluginEnabled, payload: pluginEntries});
  };
};
export const setDisablePlugin = pluginEntries => {
  return dispatch => {
    for (let plugin in pluginEntries) {
      pluginEntries[plugin].enabled = false;
    }
    showMessage({type: "success", msg: "Plugin disabled."});
    return dispatch({type: actions.pluginDisabled, payload: pluginEntries});
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
    }
  },
  {}
);
