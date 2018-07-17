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

const PLUGINS_LIST_PATH_BACKUP = path.join(
  require("electron").app.getPath("userData"),
  "pluginList-backup.json"
);

const manager = new PluginManager({pluginsPath: PLUGINS_PATH});

const fs = require("fs");
var https = require("https");

exports.getPlugins = async function() {
  try {
    backupPluginList();
    var request = await https.get(
      "https://gitlab.com/serial-lab/quartet-ui-plugins/raw/master/plugins.json",
      function(response) {
        try {
          var file = fs.createWriteStream(PLUGINS_LIST_PATH);
          response.pipe(file);
        } catch (e) {
          console.log("error writing file", e);
          networkErrorHandler();
        }
      }
    );
    request.on("error", function(err) {
      console.log("ERROR OCCURRED", err);
      networkErrorHandler();
    });
  } catch (e) {
    console.log("an error occurred fetching plugins, using fallback list", e);
    networkErrorHandler();
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

var networkErrorHandler = () => {
  try {
    // use the local backup instead.
    fs.writeFileSync(
      PLUGINS_LIST_PATH,
      fs.readFileSync(PLUGINS_LIST_PATH_BACKUP)
    );
    let pluginList = require(PLUGINS_LIST_PATH);
    if (Object.keys(pluginList).length < 1) {
      throw new Error("bad plugins list");
    }
  } catch (e) {
    console.log(
      "There is a bad plugin list and network failed, now going to copy a core cache file",
      e
    );
    // last resort.
    fallbackUseCorePluginsList();
  }
};
var backupPluginList = () => {
  try {
    //make a backup of plugins file if it exists, synchronously (yay!)
    fs.writeFileSync(
      PLUGINS_LIST_PATH_BACKUP,
      fs.readFileSync(PLUGINS_LIST_PATH)
    );
  } catch (e) {
    console.log(
      "creating a plugins list backup failed. This may be the first time running app.",
      e
    );
  }
};

var fallbackUseCorePluginsList = () => {
  // copy the core plugins list file... Last resort.
  try {
    fs.writeFileSync(
      PLUGINS_LIST_PATH,
      fs.readFileSync(path.join(__dirname, "pluginsList-fallback.json"))
    );
  } catch (e) {
    console.log("creating a plugins list backup failed", e);
  }
};

exports.require = function(pluginName) {
  return manager.require(pluginName);
};
