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

import {createStore, applyMiddleware, combineReducers, compose} from "redux";

import persistState from "redux-localstorage";
import thunk from "redux-thunk";
import dashboard from "reducers/dashboard";
import serversettings, {initialData} from "reducers/serversettings";
import layout from "reducers/layout";
import {reducer as reduxFormReducer} from "redux-form";
import {intlReducer} from "react-intl-redux";
import asyncDispatchMiddleware from "middlewares/asyncDispatchMiddleware";
import pluginReducer from "reducers/plugins";
import {pluginRegistry} from "plugins/pluginRegistration";
// initial data objects
import en from "react-intl/locale-data/en";
import fr from "react-intl/locale-data/fr";
import {addLocaleData} from "react-intl";
import messages from "./messages";
import {flattenMessages} from "./lib/flattenMessages";
import {initialData as pluginInitialData} from "./reducers/plugins";
import {initialData as layoutInitialData} from "./reducers/layout";
// http://nicolasgallagher.com/redux-modules-and-code-splitting/

addLocaleData([...en, ...fr]);
let locale = "en-US";

const initialState = {
  dashboard: {
    notifications: [
      {
        id: "93d2a5c2-0936-4798-80e2-14c3e8df2d96",
        type: "error",
        msg: "An EPCIS document with invalid GTIN EPC URN could not be parsed."
      },
      {
        id: "e3660e15-6884-4668-8401-5da19399472d",
        type: "warning",
        msg:
          "An outbound EPCIS job to 172.112.10.27 timed out. A retry will be performed in 14mn30s."
      },
      {
        id: "4314dade-aefd-49cb-b695-1add8a6a1785",
        type: "warning",
        msg: "User lduros was locked out after too many invalid token attempts."
      }
    ]
  },
  serversettings: initialData(),
  intl: {
    defaultLocale: locale,
    locale: locale,
    messages: flattenMessages(messages[locale])
  },
  layout: layoutInitialData(),
  plugins: pluginInitialData()
};
/* You can import this in pure JS classes, like Server to dispatch actions. */
export const store = configureStore(initialState);

export default function configureStore(coreInitialState) {
  const middlewares = [thunk, asyncDispatchMiddleware];
  const composeEnhancers = (() => {
    const compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (process.env.NODE_ENV === "development" && compose_) {
      return compose_({});
    }
    return compose;
  })();
  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
    persistState(["serversettings", "intl", "plugins", "layout"], {
      slicer: paths => {
        return state => {
          let subset = {};
          paths.forEach(path => {
            if (path === "plugins") {
              // remove tree nodes from persistent savings.
              subset[path] = {plugins: state[path].plugins};
            } else if (path === "intl") {
              let {messages, ...sub} = state[path];
              subset[path] = sub;
            } else {
              subset[path] = state[path];
            }
          });
          return subset;
        };
      }
    })
  );
  const initialState = {
    ...coreInitialState
  };
  const coreReducers = {
    dashboard,
    serversettings,
    form: reduxFormReducer,
    intl: intlReducer,
    locale: locale,
    layout: layout,
    plugins: pluginReducer
  };

  /*const combine = pluginReducers => {
    const pluginsState = pluginRegistry.getInitialData();
    const reducerNames = Object.keys(pluginReducers);
    for (let item of reducerNames) {
      pluginReducers[item] = state => {
        if (state === undefined) {
          state = {...pluginsState[item]};
        }
        return state;
      };
    }
    return pluginReducers;
  };*/

  const combine = pluginReducers => {
    const initialState = {
      ...pluginRegistry.getInitialData()
    };
    const reducerNames = Object.keys(pluginReducers);
    Object.keys(initialState).forEach(item => {
      if (reducerNames.indexOf(item) === -1) {
        pluginReducers[item] = state => {
          if (state === undefined) {
            state = {...initialState[item]};
          }
          return state;
        };
      }
    });
    return pluginReducers;
  };

  const store = createStore(
    //combine(pluginRegistry.getReducers()),
    combineReducers(coreReducers),
    initialState,
    enhancer
  );
  pluginRegistry.setChangeListener(pluginReducers => {
    store.replaceReducer(
      combineReducers({...coreReducers, ...combine(pluginReducers)})
    );
  });
  // enable previously enabled plugins.
  let state = store.getState();
  const pluginRepo = require("plugins/plugins-repo");
  for (let pluginName in state.plugins.plugins) {
    if (
      state.plugins.plugins[pluginName].enabled === true &&
      pluginRepo.default[pluginName]
    ) {
      let plugin = require("plugins/" +
        pluginRepo.default[pluginName].initPath);
      plugin.enablePlugin();
    }
  }
  window.store = store;
  return store;
}
