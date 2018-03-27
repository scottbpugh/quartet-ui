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
import {showMessage} from "lib/message";
import {pluginRegistry} from "plugins/pluginRegistration";
import actions from "../actions/capture";

export const initialData = () => ({
  servers: {}
});

export const loadRules = server => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .getClient()
      .then(client => {
        client.apis.capture.capture_rules_list().then(result => {
          // load steps, all steps for all rules.
          // This may become an issue in the future, if so, a new backend API endpoint
          // needs to be added.
          client.apis.capture.capture_steps_list().then(steps => {
            let rules = result.body.map(rule => {
              // add steps to the rule.
              rule.steps = steps.body.filter(step => {
                if (step.rule === rule.name) {
                  return true;
                }
                return false;
              });
              return rule;
            });
            dispatch({
              type: actions.loadRules,
              payload: {
                [server.serverID]: {rules: result.body}
              }
            });
          });
        });
      });
  };
};

export default handleActions(
  {
    [actions.loadRules]: (state, action) => {
      return {
        ...state,
        servers: {
          ...state.servers,
          ...action.payload
        }
      };
    }
  },
  {}
);
