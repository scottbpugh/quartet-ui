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
import dashboard from "./reducers/dashboard";
import serversettings from "./reducers/serversettings";
import numberrange from "./plugins/number-range/src/reducers/numberrange";
import layout from "./reducers/layout";
import {reducer as reduxFormReducer} from "redux-form";
import {intlReducer} from "react-intl-redux";
import locale from "./reducers/locales";
import asyncDispatchMiddleware from "./middlewares/asyncDispatchMiddleware";
import pluginReducer from "./reducers/plugins";

export default function configureStore(initialState, routerHistory) {
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
    persistState(["serversettings", "numberrange", "intl"])
  );
  const rootReducer = combineReducers({
    routing,
    dashboard,
    serversettings,
    numberrange,
    form: reduxFormReducer,
    intl: intlReducer,
    locale: locale,
    layout: layout,
    plugins: pluginReducer
  });
  return createStore(rootReducer, initialState, enhancer);
}
