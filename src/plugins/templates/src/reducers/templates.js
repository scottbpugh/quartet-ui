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
import actions from "../actions/templates";
const {handleActions} = qu4rtet.require("redux-actions");
const {setServerState} = qu4rtet.require("./lib/reducer-helper");
const {showMessage} = qu4rtet.require("./lib/message");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

export const initialData = () => {
  return {
    servers: {}
  };
};

const setupParams = (search, page, ordering) => {
  const params = {};
  if (search) {
    params.search = search;
  }
  if (page) {
    params.page = page;
  }
  if (ordering) {
    params.ordering = ordering;
  }
  return params;
};

export const loadTemplates = (server, search, page, ordering) => {
  const params = setupParams(search, page, ordering);
  return dispatch => {
    pluginRegistry
      .getServer(server.serverID)
      .fetchPageList("templates_templates_list", params, [])
      .then(response => {
        return dispatch({
          type: actions.loadTemplateList,
          payload: {
            serverID: server.serverID,
            templates: response.results,
            count: response.count,
            next: response.next
          }
        });
      })
      .catch(e => {
        showMessage({
          type: "error",
          id: "plugins.templates.errorLoadingTemplates",
          values: {error: e}
        });
      });
  };
};

export default handleActions(
  {
    [actions.loadTemplateList]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        templates: action.payload.templates,
        count: action.payload.count,
        next: action.payload.next
      });
    }
  },
  {}
);
