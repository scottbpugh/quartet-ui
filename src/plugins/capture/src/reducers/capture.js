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
import {setServerState} from "lib/reducer-helper";

export const initialData = () => ({
  servers: {}
});

export const loadRules = server => {
  let serverObject = pluginRegistry.getServer(server.serverID);
  return dispatch => {
    serverObject.fetchListAll("capture_rules_list", {}, []).then(rules => {
      serverObject
        .fetchListAll("capture_rule_parameters_list", {}, [])
        .then(ruleParams => {
          serverObject
            .fetchListAll("capture_step_parameters_list", {}, [])
            .then(stepParams => {
              rules.map(rule => {
                rule.params = [];
                rule.params = ruleParams.filter(ruleParam => {
                  if (ruleParam.rule === rule.id) {
                    return true;
                  }
                  return false;
                });
                // legacy name.
                rule.steps = rule.step_set || [];
                rule.steps.forEach(step => {
                  step.params = stepParams.filter(stepParam => {
                    if (stepParam.step === step.id) {
                      return true;
                    }
                    return false;
                  });
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

export const deleteStepParam = (server, stepParam) => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .getClient()
      .then(client => {
        client.apis.capture
          .capture_step_parameters_delete(stepParam)
          .then(result => {
            return dispatch(loadRules(server));
          })
          .catch(e => {
            showMessage({
              type: "error",
              msg: "An error occurred while attempting to delete step parameter"
            });
          });
      });
  };
};

export const deleteRuleParam = (server, ruleParam) => {
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .getClient()
      .then(client => {
        client.apis.capture
          .capture_rule_parameters_delete(ruleParam)
          .then(result => {
            return dispatch(loadRules(server));
          })
          .catch(e => {
            showMessage({
              type: "error",
              msg: "An error occurred while attempting to delete rule parameter"
            });
          });
      });
  };
};

export default handleActions(
  {
    [actions.loadRules]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        rules: action.payload.rules
      });
    },
    [actions.loadTasks]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        tasks: action.payload.tasks,
        count: action.payload.count,
        next: action.payload.next
      });
    },
    [serverActions.serverUpdated]: (state, action) => {
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
