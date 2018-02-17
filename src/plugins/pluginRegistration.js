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
import React from "react";
import {Route} from "react-router";

/* Holds all the components from plugins that can be injected
  into the core components (buttons, context menus, ...)
  Use an event dispatch to tie them to a component (navtree, ...)
  For the sake of simplicity we don't have an object for each type
  of component. It is a nested object, with plugins at the first level, and components second.
  e.g.: _registeredComponents['numberRange']['MyComponent']
  */
const _registeredComponents = {};

/*
  Holds a reference to all the plugins installed.
  Key is the name of the plugin.
*/
const _installedPlugins = {};

/*
  Holds all the plugin routes and can replace an existing route.
  Please be considerate of others and use your plugin name in your path,
  e.g.: <Route path="/number-range/pools:serverID component={PoolList}/>
*/
const _registeredRoutes = [];

/**
 * registerComponent - Description
 *
 * @param {type} pluginName The name of your plugin.
 * @param {type} component  The component reference.
 *
 * @return {type} Description
 */
export const registerComponent = (pluginName, component, injectAction) => {
  if (!pluginName || !component) {
    throw new Error(
      "You must enter a valid pluginName string as well as a reference to a component to register a component."
    );
  }
  _registeredComponents[
    `plugin_${pluginName}_${component.PLUGIN_COMPONENT_NAME}`
  ] = {
    pluginName: pluginName,
    component: component,
    action: injectAction
  };
};

export const getRegisteredComponents = () => {
  return {..._registeredComponents};
};
export const getRegisteredComponent = fullPluginComponentName => {
  return _registeredComponents[fullPluginComponentName].component;
};
/**
 * registerRoutes - Will add routes using the pluginName/ as part of the path.
 *
 * @param {type} pluginName Description
 * @param {type} routes     Description
 *
 * @return {type} Description
 */
export const registerRoutes = (pluginName, routes) => {};
