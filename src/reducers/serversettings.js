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
export const initialData = () => ({
  servers: [],
  currentServer: null,
  formData: {
    serverSettingName: {
      wrapper: {
        helperText:
          "The label that will be used for this server connection setting.",
        label: "Server Setting Name",
        labelFor: "serversetting-name"
      },
      input: {
        id: "serversetting-name",
        name: "serverSettingName",
        className: "pt-input",
        placeholder: "Server/Connection Name",
        type: "text",
        value: "",
        elemtype: "input"
      }
    },
    serverID: {
      input: {
        id: "server-id",
        name: "serverID",
        className: "pt-input",
        type: "hidden",
        elemtype: "input",
        value: ""
      }
    },
    serverName: {
      wrapper: {
        helperText:
          "A hostname or IP address, example localhost, serial-box.com, or 192.168.5.10.",
        label: "Server Hostname",
        labelFor: "server-name"
      },
      input: {
        id: "server-name",
        name: "serverName",
        className: "pt-input",
        placeholder: "Server Hostname",
        required: true,
        value: "",
        type: "text",
        elemtype: "input"
      }
    },
    port: {
      wrapper: {
        helperText: "A port to connect to. Example, 80, 8080, 443, ...",
        label: "Port Number",
        labelFor: "port-number"
      },
      input: {
        id: "port-number",
        name: "port",
        type: "number",
        min: "1",
        max: "65000",
        className: "pt-input",
        placeholder: "Port Number",
        required: true,
        value: "",
        elemtype: "input"
      }
    },
    path: {
      wrapper: {
        helperText: "A path required to interact with API (Optional)",
        label: "Root Path",
        labelFor: "root-path"
      },
      input: {
        id: "root-path",
        name: "path",
        className: "pt-input",
        placeholder: "Root Path",
        value: "",
        type: "text",
        elemtype: "input"
      }
    },
    ssl: {
      wrapper: {
        helperText: "SSL/TLS encryption",
        label: "SSL/TLS",
        labelFor: "ssl"
      },
      input: {
        name: "ssl",
        Label: "SSL/TLS",
        value: false,
        type: "checkbox",
        checked: false,
        elemtype: "Switch"
      }
    },
    username: {
      wrapper: {
        helperText: "Basic Auth Username",
        label: "Username",
        name: "username",
        labelFor: "username"
      },
      input: {
        id: "username",
        name: "username",
        className: "pt-input",
        placeholder: "Username",
        required: true,
        value: "",
        type: "text",
        elemtype: "input"
      }
    },
    password: {
      wrapper: {
        helperText: "Basic Auth Password",
        label: "Password",
        name: "password",
        labelFor: "password"
      },
      input: {
        id: "password",
        name: "password",
        className: "pt-input",
        placeholder: "Password",
        type: "password",
        required: true,
        elemtype: "input"
      }
    }
  }
});

export const saveServer = postData => {
  return dispatch => {
    debugger;
    showMessage({type: "success", msg: "Your server settings were saved."});
    postData.serverID = uuidv4(); // assign programatically.
    return dispatch({type: actions.saveServerSettings, payload: postData});
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
        servers: state.servers.concat(action.payload),
        formData: initialData().formData
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
