// // Copyright (c) 2018 SerialLab Corp.
// //
// // GNU GENERAL PUBLIC LICENSE
// //    Version 3, 29 June 2007
// //
// // This program is free software: you can redistribute it and/or modify
// // it under the terms of the GNU General Public License as published by
// // the Free Software Foundation, either version 3 of the License, or
// // (at your option) any later version.
// //
// // This program is distributed in the hope that it will be useful,
// // but WITHOUT ANY WARRANTY; without even the implied warranty of
// // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// // GNU General Public License for more details.
// //
// // You should have received a copy of the GNU General Public License
// // along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// const PluginManager = require("live-plugin-manager").PluginManager;
// const path = require("path");
// const fs = require("fs");
// var https = require("https");
// const isDev = require("electron-is-dev");
//
// const pluginRepoPath = (isDev || process.env.REACT_DEV === "dev") ?
//     path.join(__dirname, "devPlugins.json") : path.join(__dirname, "plugins.json");
//
// console.info('Using plugin file ' + pluginRepoPath)
//
// const PLUGINS_PATH = require('path').join(
//     __dirname, '../../src/plugins'
// )
// const PLUGINS_LIST_PATH = pluginRepoPath;
//
// const manager = new PluginManager({pluginsPath: PLUGINS_PATH});
// exports.getPlugins = function (readyCallback, timeout) {
//     if (!readyCallback) {
//         readyCallback = function () {
//         };
//     }
//     readyCallback();
// }
//
//
// var install = (exports.install = async function (pluginEntry) {
//     try {
//         let pluginList = require(PLUGINS_LIST_PATH);
//     } catch (e) {
//         console.log(e);
//     }
// });
//
// var validJSONFile = () => {
//     try {
//         let pluginsList = require(PLUGINS_LIST_PATH);
//         JSON.stringify(pluginsList);
//         if (Object.keys(pluginsList).length < 1) {
//             throw new Error("bad JSON");
//         }
//         return true;
//     } catch (e) {
//         console.log("plugins list file is bad", e);
//         return false;
//     }
// };
//
//
// var fallbackUseCorePluginsList = () => {
//     // copy the core plugins list file... Last resort.
//     try {
//         fs.writeFileSync(
//             PLUGINS_LIST_PATH,
//             fs.readFileSync(path.join(__dirname, "pluginsList-fallback.json"))
//         );
//     } catch (e) {
//         console.log("creating a plugins list backup failed", e);
//     }
// };
//
// exports.require = function (pluginName) {
//     return manager.require(pluginName);
// };
//
