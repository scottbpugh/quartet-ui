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
// Fake local storage.
const qu4rtetRequire = require("qu4rtet-ui/lib/require.js").default;

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }
}
window = global;
export const localStorage = new LocalStorageMock();

// add fake local storage for tests.
window.localStorage = localStorage;

// add fake require for ipcRenderer.
window.require = module => {
  if (module === "path") {
    return {
      join: () => {
        return "";
      }
    };
  } else if (module === "electron") {
    return {
      ipcRenderer: {
        on: () => {},
        send: () => {}
      },
      remote: {
        require: path => {
          if (path === "./main-process/plugin-manager.js") {
            return {
              install: () => {
                return {done: "ok"};
              }
            };
          }
          return {};
        },
        app: {
          getVersion: () => {
            return "test-version";
          },
          getPath: () => {
            return "somepath";
          }
        }
      }
    };
  } else {
    return qu4rtetRequire(module);
  }
};

const {qu4rtet} = require("qu4rtet-ui/lib/qu4rtet");
const React = qu4rtetRequire("react");
const {Component} = React;
