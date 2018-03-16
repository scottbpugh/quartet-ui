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

import {injectIntl} from "react-intl";

/**
 * PluginRegistry - Holds references to various plugin objects
 * such as routes, reducers, components, and localization messages.
 * Also emits an event when a reducer is added.
 */
class PluginRegistry {
  constructor() {
    this._emitChange = null;

    /*
     * Holds references to server objects (core lib/servers.js Server class)
     * Is used to retrieve api objects, server settings etc by core and plugins.
     */
    this._servers = {};

    /*
    Holds references to reducers that come from plugins.
    */
    this._reducers = {};

    /*
    initialData isn't currently used due to a bug. All plugin state start as {}.
    Code your components to handle an empty object, or fix the combine function in the main store.js
    */
    this._initialData = {};

    /*
    Holds all the localization messages for plugins, when they are enabled.
    */
    this._messages = {"en-US": {plugins: {}}, "fr-FR": {plugins: {}}};

    /* Holds all the components from plugins that can be injected
    into the core components (buttons, context menus, ...)
    Use an event dispatch to tie them to a component (navtree, ...)
    For the sake of simplicity we don't have an object for each type
    of component. plugin name and component name are concatenated together for ease of access.
    */
    this._registeredComponents = {};

    /*
    We keep an entry previously registered and remove into _unregisteredComponents.
    This is to remove it from the parent elements where it has been added (e.g.: NavTreeItems, ButtonControls, etc, ...)
    */
    this._unregisteredComponents = {};

    /*
    Holds all the plugin routes and can replace an existing route.
    Please be considerate of others and use your plugin name in your path,
    e.g.: <Route path="/number-range/pools:serverID component={PoolList}/>
    */
    this._registeredRoutes = {};
  }

  setMessages(messages) {
    for (let language in messages) {
      if (language in this._messages) {
        this._messages[language].plugins = {
          ...this._messages[language].plugins,
          ...messages[language].plugins
        };
      } else {
        this._messages[language] = {plugins: {...messages.plugins}};
      }
    }
  }

  registerComponent = (pluginName, component, injectAction) => {
    if (!pluginName || !component) {
      throw new Error(
        "You must enter a valid pluginName string as well as a reference to a component to register a component."
      );
    }
    this._registeredComponents[
      `plugin_${pluginName}_${component.PLUGIN_COMPONENT_NAME}`
    ] = {
      pluginName: pluginName,
      component: component,
      action: injectAction
    };
    try {
      // attempt to remove components from unregistered, if the plugin was enabled/disabled prior.
      delete this._unregisteredComponents[
        `plugin_${pluginName}_${component.PLUGIN_COMPONENT_NAME}`
      ];
    } catch (e) {
      // ignore if this is the first time.
    }
  };

  unregisterComponent = (pluginName, component, injectAction) => {
    if (!pluginName || !component) {
      throw new Error(
        "You must enter a valid pluginName string as well as a reference to a component to register a component."
      );
    }
    let fullPluginComponentName = `plugin_${pluginName}_${
      component.PLUGIN_COMPONENT_NAME
    }`;
    this._unregisteredComponents[fullPluginComponentName] = {
      pluginName: pluginName,
      component: component,
      action: injectAction
    };

    try {
      delete this._registeredComponents[
        `plugin_${pluginName}_${component.PLUGIN_COMPONENT_NAME}`
      ];
    } catch (e) {
      //don't bother if it doesn't exist.
    }
  };

  getUnregisteredComponents = () => {
    return {...this._unregisteredComponents};
  };

  getRegisteredComponents = () => {
    return {...this._registeredComponents};
  };

  getRegisteredComponent = fullPluginComponentName => {
    try {
      return injectIntl(
        this._registeredComponents[fullPluginComponentName].component
      );
    } catch (e) {}
  };

  registerRoutes = (pluginName, routes) => {
    this._registeredRoutes[pluginName] = routes;
  };

  unregisterRoutes = pluginName => {
    delete this._registeredRoutes[pluginName];
  };

  getRegisteredRoutes = () => {
    return {...this._registeredRoutes};
  };

  getArrayRoutes = () => {
    let routes = [];
    for (let plugin in this._registeredRoutes) {
      routes = routes.concat(this._registeredRoutes[plugin]);
    }
    return routes;
  };

  getMessages() {
    return {...this._messages};
  }

  setInitialData(name, dataObject) {
    this._initialData[name] = dataObject;
  }

  getInitialData() {
    return {...this._initialData};
  }

  getReducers() {
    return {...this._reducers};
  }

  registerReducer(pluginName, name, reducer, initialData) {
    this.setInitialData(name, initialData);
    this._reducers = {...this._reducers, [name]: reducer};
    if (this._emitChange) {
      this._emitChange(this.getReducers());
    }
  }

  registerServer(serverRef) {
    this._servers[serverRef.serverID] = serverRef;
  }
  removeServer(serverRef) {
    delete this._servers[serverRef.serverID];
  }
  getServer(serverID) {
    return this._servers[serverID];
  }
  registerIntl(intl) {
    // not the best way to get a hold of the intl element,
    // but we need it in certain lib methods in plugins to
    // send a message without cluttering each component
    // that use them.
    this.intl = intl;
  }
  getIntl() {
    // might do some checks first here.
    return this.intl;
  }
  setChangeListener(listener) {
    this._emitChange = listener;
  }
}

// export only a singleton. Entire app and all plugins share one PluginRegistry object.
export const pluginRegistry = new PluginRegistry();
