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

const PluginManager = require("live-plugin-manager").PluginManager;
const path = require("path");
const PLUGINS_PATH = require("path").join(
  require("electron").app.getPath("userData"),
  "packages"
);
const PLUGINS_LIST_PATH = path.join(
  require("electron").app.getPath("userData"),
  "pluginList.json"
);
const manager = new PluginManager({pluginsPath: PLUGINS_PATH});

const fs = require("fs");
var https = require("https");

exports.getPlugins = async function() {
  try {
    var file = fs.createWriteStream(PLUGINS_LIST_PATH);
    var request = https.get(
      "https://gitlab.com/serial-lab/quartet-ui-plugins/raw/master/plugins.json",
      function(response) {
        response.pipe(file);
      }
    );
  } catch (e) {
    console.log("an error occurred fetching plugins", e);
  }
};

exports.install = async function(pluginEntry) {
  try {
    let pluginList = require(PLUGINS_LIST_PATH);
    if (pluginList[pluginEntry.pluginName].version === pluginEntry.version) {
      // this is already the latest version, don't DDOS NPM.
      return await manager.createPluginInfo(pluginEntry.pluginName);
    }
    let installedPlugin = null;
    if (pluginEntry.local === true) {
      installedPlugin = await manager.installFromPath(pluginEntry.packagePath);
    } else {
      installedPlugin = await manager.install(pluginEntry.packagePath);
    }
    return installedPlugin;
  } catch (e) {
    console.log(e);
  }
};

exports.require = function(pluginName) {
  return manager.require(pluginName);
};
