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

export const saveServer = formData => {
  return dispatch => {
    showMessage({type: "success", msg: "Your server settings were saved."});
    return dispatch({type: actions.saveServerSettings, payload: formData});
  };
};

export const updateValue = (name, value) => {
  return dispatch => {
    return dispatch({type: actions.updateServerForm, payload: {name, value}});
  };
};

export default handleActions(
  {
    [actions.saveServerSettings]: (state, action) => {
      return {
        ...state,
        servers: state.servers.concat(action.payload)
      };
    },
    [actions.updateServerForm]: (state, action) => {
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: {
            ...state.formData[action.payload.name],
            input: {
              ...state.formData[action.payload.name].input,
              ...action.payload
            }
          }
        }
      };
    }
  },
  {}
);
