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
import {setEnablePlugin} from "reducers/plugins";
import {updateMessages} from "reducers/locales";

addLocaleData([...en, ...fr]);
let locale = "en-US";

const initialState = {
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
              // remove messages, to force a refresh of them each time.
              let {messages, ...sub} = state[path];
              subset[path] = sub;
            } else {
              // otherwise, keep entire sub state.
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
  if ("NumberRange" in state.plugins.plugins) {
    // old version. Wipe plugins.
    console.log("Old plugins structure, resetting");
    store.dispatch({
      type: "PLUGINS_RESET_PLUGINS",
      payload: pluginInitialData().plugins
    });
  }
  for (let pluginName in state.plugins.plugins) {
    try {
      if (state.plugins.plugins[pluginName].enabled === true) {
        window.qu4rtet
          .getPluginModule(state.plugins.plugins[pluginName])
          .then(pluginObject => {
            pluginObject.enablePlugin();
            store.dispatch(updateMessages(state.intl.locale));
            store.dispatch(
              setEnablePlugin({
                [pluginName]: {
                  ...state.plugins.plugins[pluginName],
                  loaded: new Date().toString()
                }
              })
            );
          });
      }
    } catch (e) {
      console.log("An error occurred loading plugin", e);
    }
  }
  window.store = store;
  return store;
}
window.qu4rtet.exports("store", this);
