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

// A helper function meant to make life a little easier in reducers.

/**
 * Unknown - Description
 *
 * @param {object} [state={}]       The reducer state
 * @param {type}   serverID         The serverID
 * @param {object} [mergeObject={}] The object to merge into the state for this server.
 *
 * @return {type} Description
 */
export const setServerState = (state = {}, serverID, mergeObject = {}) => {
  if (!serverID) {
    throw new Error(
      "A server ID must be defined to set the server state in reducer."
    );
  }
  let copy = {...state}; // use a copy of state for manipulations.
  if (!copy.servers) {
    // if servers are not created yet, create an object.
    copy.servers = {};
  }
  if (!copy.servers[serverID]) {
    // if there is no object for this server, create it.
    copy.servers[serverID] = {};
  }
  return {
    ...copy,
    servers: {
      ...copy.servers,
      [serverID]: {
        ...copy.servers[serverID],
        ...mergeObject
      }
    }
  };
};
