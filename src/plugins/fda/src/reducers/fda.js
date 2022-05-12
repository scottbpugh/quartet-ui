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
import actions from "../actions/fda";
const {handleActions} = qu4rtet.require("redux-actions");
const {setServerState} = qu4rtet.require("./lib/reducer-helper");
const {showMessage} = qu4rtet.require("./lib/message");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

export const initialData = () => {
  return {
    servers: {}
  };
};

export const searchFDA = (server, searchField, lookup, skip) => {
  return dispatch => {
    fetch(
      `https://api.fda.gov/drug/label.json?search=${searchField}:${lookup}&limit=20&skip=${skip}`
    )
      .then(response => {
        if (!response.ok) {
          throw Error(response);
        }
        return response.json();
      })
      .then(data => {
        if (data.results && data.meta) {
          return dispatch({
            type: actions.loadFDAResults,
            payload: {
              serverID: server.serverID,
              searchField: searchField,
              lookup: lookup,
              items: data.results,
              skip: data.meta.results.skip,
              total: data.meta.results.total
            }
          });
        }
      })
      .catch(error => {
        return dispatch({
          type: actions.loadFDAResults,
          payload: {
            serverID: server.serverID,
            searchField: searchField,
            lookup: lookup,
            items: [],
            skip: 0,
            total: 0
          }
        });
        console.log(error);
      });
  };
};

export default handleActions(
  {
    [actions.loadFDAResults]: (state, action) => {
      return setServerState(state, action.payload.serverID, {
        fdaSearchField: action.payload.searchField,
        fdaLookup: action.payload.lookup,
        fdaItems: action.payload.items,
        fdaSkip: action.payload.skip,
        fdaTotal: action.payload.total
      });
    }
  },
  {}
);
