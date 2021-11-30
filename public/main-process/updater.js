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

// const autoUpdater = require("electron-updater").autoUpdater;
// autoUpdater.logger = require("electron-log");
// autoUpdater.logger.transports.file.level = "info";

// exports.checkLatestUpdate = function() {
//   try {
//     autoUpdater.checkForUpdatesAndNotify();
//   } catch (e) {
//     console.log("Updater failed", e);
//   }

  /*
  autoUpdater.setFeedURL({
    provider: "generic",
    url:
      "https://gitlab.com/lduros/quartet-ui/builds/artifacts/master/raw/dist?job=build"
  });
  autoUpdater.on("checking-for-update", function() {
    sendStatusToWindow("Checking for update...");
  });

  autoUpdater.on("update-available", function(info) {
    sendStatusToWindow("Update available.", info);
  });

  autoUpdater.on("update-not-available", function(info) {
    sendStatusToWindow("Update not available.", info);
  });

  autoUpdater.on("error", function(err) {
    sendStatusToWindow("Error in auto-updater.", err);
  });

  autoUpdater.on("download-progress", function(progressObj) {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message =
      log_message + " - Downloaded " + parseInt(progressObj.percent) + "%";
    log_message =
      log_message +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";
    sendStatusToWindow(log_message);
  });

  autoUpdater.on("update-downloaded", function(info) {
    sendStatusToWindow("Update downloaded; will install in 1 seconds", info);
  });

  autoUpdater.on("update-downloaded", function(info) {
    setTimeout(function() {
      autoUpdater.quitAndInstall();
    }, 1000);
  });

  autoUpdater.checkForUpdates();

  function sendStatusToWindow(message, info) {
    console.log(message, info ? info : null);
  }*/
// };
