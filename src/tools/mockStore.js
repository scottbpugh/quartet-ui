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
import React, {Component} from "react";

import {IntlProvider} from "react-intl";
import {addLocaleData} from "react-intl";
import en from "react-intl/locale-data/en";
import fr from "react-intl/locale-data/fr";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import MockInitialState from "./mock-initial-state";
import {Provider} from "react-redux";
import {MemoryRouter as Router} from "react-router-dom";
import {injectIntl} from "react-intl";

// Fake local storage.
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
    if (module === "path") {
      return {
        join: () => {
          return "";
        }
      };
    }
    if (module === "electron") {
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
    }
  };
}

let {qu4rtet} = require("qu4rtet");
let {pluginRegistry} = require("plugins/pluginRegistration");
let {returnAllMessages} = require("reducers/locales");

addLocaleData([...en, ...fr]);
let defaultLocale = "en-US";
const middlewares = [thunk];
/*
      remote: {
        app: {
          getVersion: function() {
            return "test-version";
          }
        }
*/
export const initialState = MockInitialState;

// Used by certain tests.
export const updateRegistryIntl = (locale, messages) => {
  const {intl} = new IntlProvider({
    locale: locale,
    messages: messages,
    defaultLocale: "en-US"
  }).getChildContext();
  pluginRegistry.registerIntl(intl);
};

export const mockStore = configureStore(middlewares);

// used to get a ref of the intl into our tests.
class _Wrapper extends Component {
  componentDidMount() {
    pluginRegistry.registerIntl(this.props.intl);
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}
const Wrapper = injectIntl(_Wrapper);

// The TestWrapper to use for your tests.
export const TestWrapper = ({locale, messages, store, children}) => {
  if (!store) {
    // it uses the default "real app" store if no store is specified.
    store = require("store").store;
  }
  if (locale === undefined) {
    locale = defaultLocale;
  }
  if (messages === undefined) {
    messages = returnAllMessages(locale);
  }
  return (
    <IntlProvider locale={locale} messages={messages}>
      <Wrapper>
        <Provider store={store}>
          <Router>{children}</Router>
        </Provider>
      </Wrapper>
    </IntlProvider>
  );
};
