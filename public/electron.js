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
const Menu = electron.Menu;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const os = require("os");
const opn = require("opn");
const url = require("url");
const path = require("path");
const fs = require("fs");
const setTimeout = require("timers").setTimeout;

'use strict';


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

if (isDev === true) {
  const reload = require('electron-reload')(path.join(__dirname, '../src'));
}

function setAppMenu() {
  let viewArray = [
    {role: "resetzoom"},
    {role: "zoomin"},
    {role: "zoomout"},
    {type: "separator"},
    {role: "togglefullscreen"}
  ];
  if (isDev || process.env.REACT_DEV === "dev") {
    console.log("Enabling Dev Tools");
    viewArray.push({type: "separator"});
    viewArray.push({role: "toggledevtools"});
  }
  var template = [
    {
      label: "QU4RTET",
      submenu: [
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: function () {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          selector: "cut:"
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          selector: "copy:"
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          selector: "paste:"
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    },
    {
      label: "View",
      submenu: viewArray
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

if (isDev) {
  console.log("Enabling hot reload.");
  require("electron-reload")(path.join(__dirname));
}
if (process.env.REACT_DEV === "dev") {
  process.env.NODE_ENV = "development";
} else {
  process.env.NODE_ENV = "production";
}

async function createWindow() {
  let splash = require("./main-process/splash.js")
    .renderSplashScreen();
  electron.session.defaultSession.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({responseHeaders: `script-src 'self'; child-src 'self';`});
    }
  );
  let pluginManager = null;

  var removeSplashAndLoadApp = function () {
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
    const options = { extraHeaders: 'pragma: no-cache\n' }
    mainWindow.loadURL("file://" + __dirname + "/build/index.html", options);
    if (process.env.REACT_DEV === "dev") {
      try {
        console.info('Trying to add react dev tools extension.');
        BrowserWindow.addDevToolsExtension(
          path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.4.0_0')
        );
        console.info('Trying to add the redux devtools extension.');
        BrowserWindow.addDevToolsExtension(
          path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
        );
      } catch (e) {
        throw new Error('There was an error trying to load the react dev tools and/or the ' +
          'Redux dev tools.  Check the paths specified in the electron.js and make sure they ' +
          'contain the correct version and path info.');
      }
      // Open the DevTools
      mainWindow.webContents.openDevTools();
    }
    mainWindow.webContents.on("will-navigate", evt => {
      console.log("no navigation allowed.");
      evt.preventDefault();
    });
    mainWindow.once("ready-to-show", () => {
      mainWindow.show();
      splash.destroy();
      checkLatestUpdate();
    });
    setAppMenu();
    // Emitted when the window is closed.
    mainWindow.once("closed", function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      //mainWindow.webContents.removeListener("new-window");
      //mainWindow.webContents.removeListener("will-navigate");
      //credManagement.unregisterCredentialEvents(mainWindow);
      mainWindow.destroy();
      mainWindow = null;
    });
    mainWindow.webContents.on("new-window", function (event, url) {
      event.preventDefault();
      openBrowserResource(url);
    });
  };

  try {
    pluginManager = require("./main-process/plugin-manager.js");
    pluginManager.getPlugins(removeSplashAndLoadApp);
  } catch (e) {
    console.log("error", e);
    // recover from any kind of network or Gitlab issues.
    removeSplashAndLoadApp();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// only allow a single instance cross-OS.
var shouldQuit = app.makeSingleInstance(function (
  commandLine,
  workingDirectory
) {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});
if (shouldQuit) {
  console.log("QU4RTET UI already running. Quitting.");
  app.quit();
  return;
}

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }

});
