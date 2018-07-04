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

const manager = new PluginManager({pluginsPath: PLUGINS_PATH});

const fs = require("fs");
var https = require("https");

exports.getPlugins = async function() {
  try {
    const pluginListPath = path.join(
      require("electron").app.getPath("userData"),
      "pluginList.json"
    );
    var file = fs.createWriteStream(pluginListPath);
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
  console.log("about to install ", pluginEntry);

  let installedPlugin = null;
  try {
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
