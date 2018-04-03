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

import {IntlProvider} from "react-intl";
import {addLocaleData} from "react-intl";
import en from "react-intl/locale-data/en";
import fr from "react-intl/locale-data/fr";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import {pluginRegistry} from "plugins/pluginRegistration";
import MockInitialState from "./mock-initial-state";

addLocaleData([...en, ...fr]);
let defaultLocale = "en-US";
const middlewares = [thunk];

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

export const localStorage = new LocalStorageMock();
if (window && !window.localStorage) {
  // add fake local storage for tests.
  window.localStorage = localStorage;
}

if (window && !window.require) {
  // add fake require for ipcRenderer.
  window.require = module => {
    if (module === "electron") {
      return {ipcRenderer: {on: () => {}, send: () => {}}};
    }
  };
}

/*export let initialState = {
  dashboard: {notifications: []},
  serversettings: {
    servers: {
      "d0246781-67c6-474b-8ab0-29de61b6e6bb": {
        serverID: "d0246781-67c6-474b-8ab0-29de61b6e6bb",
        protocol: "http",
        port: "8000",
        path: "",
        ssl: false,
        hostname: "localhost",
        serverSettingName: "box 1",
        url: "http://localhost:8000/",
        appList: ["", "capture", "epcis", "manifest", "rest-auth", "serialbox"],
        username: "admin",
        password: "test"
      }
    }
  },
  intl: {
    defaultLocale: defaultLocale,
    locale: defaultLocale,
    messages: flattenMessages(messages[defaultLocale])
  },
  layout: {pageTitle: {id: "app.nav.servers"}, theme: "dark-brown"},
  plugins: {plugins: {}, navTreeItems: []}
};*/

export const initialState = MockInitialState;

export const updateRegistryIntl = (locale, messages) => {
  const {intl} = new IntlProvider({
    locale: locale,
    messages: messages,
    defaultLocale: "en-US"
  }).getChildContext();
  pluginRegistry.registerIntl(intl);
};

export const mockStore = configureStore(middlewares);

export const TestWrapper = ({locale, messages, children}) => {
  if (locale === undefined) {
    locale = defaultLocale;
  }
  if (messages === undefined) {
    messages = initialState.intl.messages;
  }
  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};
