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
import actions from "../actions/serversettings";
import {showMessage} from "../lib/message";
import uuidv4 from "uuid/v4";

/**
 * initialData - Returns the initial data for
 * the Redux store for this form.
 * Used in index.js to initialized the store.
 *
 * It is a JSON-serializable object representing the form
 */
export const initialData = () => {
  let _initialData = {
    servers: {}, // uuid key to objects
    currentServer: null
  };
  return _initialData;
};

export const saveServer = postData => {
  return dispatch => {
    showMessage({type: "success", msg: "Your server settings were saved."});
    let server = {...postData};
    server.plugins = [];
    server.plugins.push("number-range");
    if (!postData.serverID) {
      postData.serverID = uuidv4();
    }
    return dispatch({type: actions.saveServerSettings, payload: postData});
  };
};

export const loadCurrentServer = serverData => {
  return dispatch => {
    return dispatch({type: actions.loadCurrentServer, payload: serverData});
  };
};

export default handleActions(
  {
    [actions.loadCurrentServer]: (state, action) => {
      return {
        ...state,
        formData: initialData(action.payload).formData
      };
    },
    [actions.saveServerSettings]: (state, action) => {
      return {
        ...state,
        servers: {...state.servers, [action.payload.serverID]: action.payload},
        formData: initialData().formData
      };
    }
  },
  {}
);
