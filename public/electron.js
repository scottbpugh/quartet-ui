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
const credManagement = require("./main-process/credentials-management");
const checkLatestUpdate = require("./main-process/updater").checkLatestUpdate;

const electron = require("electron");
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const opn = require("opn");
const url = require("url");
const path = require("path");
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
global.mainWindow = mainWindow;
/**
 * Opens a window for the default browser.
 */
function openBrowserResource(url) {
  opn(url);
}

const isDev = require("electron-is-dev");

if (isDev) {
  console.log("Enabling hot reload.");
  require("electron-reload")(path.join(__dirname));
} else {
  process.env.NODE_ENV = "production";
}

function createWindow() {
  electron.session.defaultSession.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({responseHeaders: `script-src 'self'; child-src 'self';`});
    }
  );
  require("./main-process/plugin-manager.js").getPlugins(app.getAppPath());

  // Create the browser window.
  const mainOptions = {
    width: 1600,
    height: 1200,
    show: false
  };
  mainWindow = new BrowserWindow(mainOptions);
  // Setting this to exchange credentials information
  credManagement.setCredentialEvents(mainWindow);
  // and load the index.html of the app.
  mainWindow.loadURL("file://" + __dirname + "/build/index.html");
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  mainWindow.webContents.on("will-navigate", evt => {
    console.log("no navigation allowed.");
    evt.preventDefault();
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    checkLatestUpdate();
  });
  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.webContents.on("new-window", function(event, url) {
    event.preventDefault();
    openBrowserResource(url);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  if (isDev) {
    console.log("Delaying display of window.");
    // cheap way of preventing the constant reload from electron-reload.
    const setTimeout = require("timers").setTimeout;
    setTimeout(() => {
      console.log("About to display dev window");
      createWindow();
    }, 8000);
  } else {
    createWindow();
  }
});

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
