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

import {createStore, applyMiddleware, combineReducers, compose} from "redux";
import {
  routerMiddleware,
  routerReducer as routing,
  push
} from "react-router-redux";
import persistState from "redux-localstorage";
import thunk from "redux-thunk";
import dashboard from "reducers/dashboard";
import serversettings from "reducers/serversettings";
import numberrange from "plugins/number-range/src/reducers/numberrange";
import layout from "reducers/layout";
import {reducer as reduxFormReducer} from "redux-form";
import {intlReducer} from "react-intl-redux";
import locale from "reducers/locales";
import asyncDispatchMiddleware from "middlewares/asyncDispatchMiddleware";
import pluginReducer from "reducers/plugins";

import {pluginRegistry} from "plugins/pluginRegistration";

// http://nicolasgallagher.com/redux-modules-and-code-splitting/

export default function configureStore(coreInitialState, routerHistory) {
  const router = routerMiddleware(routerHistory);
  const middlewares = [thunk, router, asyncDispatchMiddleware];
  const composeEnhancers = (() => {
    const compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (process.env.NODE_ENV === "development" && compose_) {
      return compose_({push});
    }
    return compose;
  })();
  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
    persistState(["serversettings", "intl", "numberrange", "plugins"])
  );
  const initialState = {
    ...coreInitialState,
    ...pluginRegistry.getInitialData()
  };
  const coreReducers = {
    routing,
    dashboard,
    serversettings,
    form: reduxFormReducer,
    intl: intlReducer,
    locale: locale,
    layout: layout,
    plugins: pluginReducer
  };

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
  for (let pluginName in state.plugins.plugins) {
    if (state.plugins.plugins[pluginName].enabled === true) {
      console.log("Loading", pluginName);
      let plugin = require("plugins/" +
        state.plugins.plugins[pluginName].initPath);
      plugin.enablePlugin();
    }
  }
  return store;
}
