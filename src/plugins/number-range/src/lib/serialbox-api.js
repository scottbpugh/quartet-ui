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
import base64 from "base-64";

/**
 * getPools - Description
 *
 * @param {object} server A serversetting object.
 *
 * @return {object} A JSON object.
 */
export const getPools = server => {
  let protocol = server.ssl === "true" ? "https" : "http";
  let hostname = server.serverName;
  let port = server.port || 80;
  let username = server.username;
  let password = server.password;
  let path = server.path + "";
  let headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append(
    "Authorization",
    "Basic " + base64.encode(username + ":" + password)
  );
  let initReq = {
    method: "GET",
    headers: headers,
    credentials: "include",
    mode: "cors"
  };
  let url = `${protocol}://${hostname}:${port}/${path}pools/?related=true`;
  return fetch(url, initReq)
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      return error;
    });
};

/**
 * getRegion - Description
 *
 * @param {object} server   A serversetting Object
 * @param {string} regionName A region machine name
 *
 * @return {object} A JSON response.
 */
export const getRegion = (server, regionName) => {
  let protocol = server.ssl === "true" ? "https" : "http";
  let hostname = server.serverName;
  let port = server.port || 80;

  let path = server.path + "";
  let headers = new Headers();

  let url = `${protocol}://${hostname}:${port}/${path}sequential-region-detail/${regionName}/`;
  return getRegionByURL(server, url);
};

/**
 * getRegionByURL - Similar to getRegion but no URL logic.
 *
 * @param {string} url A full URL to the API endpoint.
 *
 * @return {object} A JSON object.
 */
export const getRegionByURL = (server, url) => {
  let username = server.username;
  let password = server.password;
  let headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append(
    "Authorization",
    "Basic " + base64.encode(username + ":" + password)
  );
  let initReq = {
    method: "GET",
    headers: headers,
    credentials: "include",
    mode: "cors"
  };
  return fetch(url, initReq)
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      return error;
    });
};

export const getRegions = (server, pool) => {
  let promises = [];
  for (let url of pool.sequentialregion_set) {
    promises.push(getRegionByURL(server, url));
  }
  return Promise.all(promises);
};
