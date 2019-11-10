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

import React from "react";
import clearModule from "clear-module";

let electron = window.require("electron");
let path = window.require("path");
let pluginManager = electron.remote.require("./main-process/plugin-manager.js");

/* A global class which contains everything require for plugin development */
class Qu4rtet {
  /* An object (hashmap) with path to module resolution. Modules register themselves directly.*/
  modules = {};
  electron = electron;
  path = path;
  pluginManager = pluginManager;
  userData = electron.remote.app.getPath("userData");
  pluginPath = path.join(__dirname, "plugins");
  exports = (path, exports) => {
    this.modules[path] = exports || {};
  };

  getPluginModule = async pluginEntry => {
    console.info('activating plugin at path ' + pluginEntry.initPath);
    let pluginObject;
    if (pluginEntry.packagePath) {
      let installedPlugin = await window.qu4rtet.pluginManager.install(
        pluginEntry
      );
      let pluginPath = this.path.join(this.pluginPath, installedPlugin.name);
      // make sure to uncache first. We want to refresh the content.
      try {
        //console.log(installedPlugin.name);
        clearModule.match(new RegExp(installedPlugin.name));
      } catch (e) {
        console.log(e);
      }
      pluginObject = window.require(pluginPath);
    } else {
      console.info('looking for plugin here: ' + "./plugins/" + pluginEntry.initPath);
      pluginObject = require("./plugins/" + pluginEntry.initPath);
    }
    return pluginObject;
  };

  /**
   * require - A proxy function for the real require.
   *
   * @param {type} path Description
   *
   * @return {type} Description
   */
  require = path => {
    try {
      if (this.modules[path] !== undefined) {
        return this.modules[path];
      }
      return window.require(path);
    } catch (e) {
      return window.require(path);
    }
  };
}

export const qu4rtet = new Qu4rtet();

// preload a bunch of common packages that we allow plugins to use (for unimaginable reasons.)
let reusableModules = [
  "react",
  "react-redux",
  "react-intl",
  "@blueprintjs/core",
  "react-router",
  "base-64",
  "json2csv",
  "openlayers",
  "moment",
  "react-router-dom",
  "swagger-client",
  "redux-thunk",
  "redux-form",
  "redux-actions",
  "@blueprintjs/datetime",
  "redux-localstorage",
  "react-dom",
  "prop-types",
  "object-path"
];
for (let aModule of reusableModules) {
  qu4rtet.exports(aModule, window.require(aModule));
}
window.qu4rtet = qu4rtet;
