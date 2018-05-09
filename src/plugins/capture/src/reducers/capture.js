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
import serverActions from "actions/serversettings";

export const initialData = () => ({
  servers: {}
});

export const loadRules = server => {
  let serverObject = pluginRegistry.getServer(server.serverID);
  return dispatch => {
    serverObject.fetchListAll("capture_rules_list", {}, []).then(rules => {
      serverObject.fetchListAll("capture_steps_list", {}, []).then(steps => {
        serverObject
          .fetchListAll("capture_rule_parameters_list", {}, [])
          .then(ruleParams => {
            rules.map(rule => {
              rule.params = [];
              rule.params = ruleParams.filter(ruleParam => {
                if (ruleParam.rule === rule.id) {
                  return true;
                }
                return false;
              });
              rule.steps = steps.filter(step => {
                if (step.rule === rule.id) {
                  return true;
                }
                return false;
              });
              return rule;
            });
            return dispatch({
              type: actions.loadRules,
              payload: {
                serverID: server.serverID,
                rules: rules
              }
            });
          });
      });
    });
  };
};

export const deleteRule = (server, rule) => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .getClient()
      .then(client => {
        client.apis.capture.capture_rules_delete(rule).then(result => {
          return dispatch(loadRules(server));
        });
      });
  };
};

export const loadTasks = (server, search, page, ordering) => {
  debugger;
  let params = {};
  if (search) {
    params.search = search;
  }
  if (page) {
    params.page = page;
  }
  if (ordering) {
    params.ordering = ordering;
  }
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("capture_tasks_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadTasks,
          payload: {
            serverID: server.serverID,
            tasks: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          msg: "An error occurred while attempting to fetch tasks."
        });
      });
  };
};

export const deleteStep = (server, step) => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .getClient()
      .then(client => {
        client.apis.capture.capture_steps_delete(step).then(result => {
          return dispatch(loadRules(server));
        });
      });
  };
};

export default handleActions(
  {
    [actions.loadRules]: (state, action) => {
      if (!state.servers) {
        // temporary debug fix.
        state.servers = {};
      }
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.serverID]: {
            ...state.servers[action.payload.serverID],
            rules: action.payload.rules
          }
        }
      };
    },
    [actions.loadTasks]: (state, action) => {
      if (!state.servers) {
        // temporary debug fix.
        state.servers = {};
      }
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.serverID]: {
            ...state.servers[action.payload.serverID],
            tasks: action.payload.tasks,
            count: action.payload.count,
            next: action.payload.next
          }
        }
      };
    },
    [serverActions.serverUpdated]: (state, action) => {
      // we want to reload pools when new server is saved.
      /*action.asyncDispatch(
        loadPools(pluginRegistry.getServer(action.payload))
      );*/
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.serverID]: {}
        }
      };
    }
  },
  {}
);
