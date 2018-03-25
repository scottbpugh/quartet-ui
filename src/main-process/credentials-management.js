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

// This is used to store credentials in the system password store so that
// we delegate security of password storage to the underlying operating system.

const keytar = require("keytar");
let registered = false;

exports.setCredentialEvents = function(mainWindow) {
  mainWindow.webContents.send("credentialsRetrieved", "hello there");
  const ipcMain = require("electron").ipcMain;
  const ipcRenderer = require("electron").ipcRenderer;

  console.log("Registering credential events");
  ipcMain.on("setServerCredentials", (event, payload) => {
    console.log("set Password payload", JSON.stringify(payload));
    keytar
      .setPassword("QU4RTET", payload.account, payload.password)
      .then(function() {
        keytar.getPassword("QU4RTET", payload.account).then(function(password) {
          mainWindow.webContents.send("credentialsRetrieved", {
            account: payload.account,
            password: password
          });
        });
      });
    console.log("Received payload", JSON.stringify(payload));
  });
  ipcMain.on("getServerCredentials", (event, account) => {
    keytar.getPassword("QU4RTET", account.account).then(function(password) {
      mainWindow.webContents.send("credentialsRetrieved", {
        account: account.account,
        password: password
      });
    });
  });
};
