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
import stringHash from "string-hash";
import React, {Component} from "react";
import {Switch, Route} from "react-router";
import {withRouter} from "react-router-dom";
import App from "components/App";
import Dashboard from "components/screens/Dashboard";
import {ServerSettings} from "components/screens/server/ServerSettings";
import {PluginList} from "components/screens/plugins/PluginList";
import {connect} from "react-redux";
import {pluginRegistry} from "plugins/pluginRegistration";
import {updateMessages} from "reducers/locales";
import {ServerDetails} from "components/screens/server/ServerDetails";
import AddLocalPlugin from "components/screens/plugins/AddLocalPlugin";
import {AccessDenied} from "components/screens/auth/AccessDenied";

const coreRoutes = () => {
  return [
    <Route key="dashboard" exact path="/" component={Dashboard} />,

    <Route
      key="serversettings"
      path="/server-settings/:serverID?"
      component={ServerSettings}
    />,
    <Route
      key="serverdetails"
      path="/server-details/:serverID?"
      component={ServerDetails}
    />,
    <Route key="pluginList" path="/plugins/add" component={AddLocalPlugin} />,
    <Route key="pluginList" path="/plugins" component={PluginList} />,
    <Route key="accessDenied" path="/access-denied" component={AccessDenied} />
  ];
};

/**
 * _QSwitch - Loads routes, internationalization of plugins, and dynamic plugin-based components.
 * @extends Component
 */
class _RouteSwitcher extends Component {
  constructor(props) {
    super(props);
    this.routes = coreRoutes();
    this.processingPlugins = false;
    this.queueProcessPlugins = null;
    //this.processCallsCount = 0;
    this.previousComponentsCount = 0;
  }

  processPlugins() {
    if (!this.queueProcessPlugins) {
      this.props.dispatch(updateMessages(this.props.intl.locale));
    }
    if (this.queueProcessPlugins) {
      window.clearTimeout(this.queueProcessPlugins);
    }
    const pluginComponents = pluginRegistry.getRegisteredComponents();
    const disabledPluginComponents = pluginRegistry.getUnregisteredComponents();
    // Compare whether this is a component disable or enable.
    if (Object.keys(pluginComponents).length < this.previousComponentsCount) {
      this.previousComponentsCount = Object.keys(pluginComponents).length;
      this._processPlugins();
      return;
    }
    // for enabling, we can stack execution and prevent other executions in parallel.
    this.previousComponentsCount = Object.keys(pluginComponents).length;
    // delayed call for enabling, to prevent massive
    // loops in plugin processing (for large number of plugins.)
    this.queueProcessPlugins = window.setTimeout(
      this._processPlugins.bind(this),
      500
    );
  }
  _processPlugins() {
    // add new routes
    this.routes = coreRoutes().concat(pluginRegistry.getArrayRoutes());
    const pluginComponents = pluginRegistry.getRegisteredComponents();
    const disabledPluginComponents = pluginRegistry.getUnregisteredComponents();
    /*console.log(
      "processPlugins called with",
      this.routes.length,
      " routes, call number",
      ++this.processCallsCount
    );*/
    // add new components.

    for (const pluginComponentName in pluginComponents) {
      const entry = pluginComponents[pluginComponentName];
      this.props.dispatch({
        type: entry.action,
        payload: {
          pluginName: entry.pluginName,
          pluginComponentName
        }
      });
    }
    this.props.dispatch(updateMessages(this.props.intl.locale));
    // remove unregistered components.
    for (const pluginComponentName in disabledPluginComponents) {
      const entry = disabledPluginComponents[pluginComponentName];
      this.props.dispatch({
        type: entry.action,
        payload: {
          pluginName: entry.pluginName,
          pluginComponentName
        }
      });
    }
    this.processingPlugins = false;
  }

  componentDidMount() {
    this.processPlugins();
  }

  componentWillReceiveProps(nextProps) {
    if (this.processingPlugins === true) {
      // Don't process multiple times plugin changes or
      // multiple plugins being loaded at the same time (as in startup.)
      console.log("reload prevented");
      return;
    }
    if (
      JSON.stringify(this.props.plugins) !== JSON.stringify(nextProps.plugins)
    ) {
      this.processPlugins();
    } else if (
      nextProps.pluginListUpdated &&
      this.props.pluginListUpdated != true
    ) {
      console.log("Executed once");
      this.props.dispatch({
        type: "PLUGINS_PLUGIN_LIST_UPDATED",
        payload: false
      });
      if (this.processingPlugins === false) {
        this.processingPlugins = true;
        setTimeout(() => {
          this.processPlugins();
        }, 1000);
      }
    }
  }

  render() {
    return (
      <App>
        <Switch>{this.routes}</Switch>
      </App>
    );
  }
}
const RouteSwitcher = connect(
  state => {
    return {
      pluginListUpdated: state.plugins.pluginListUpdated,
      plugins: state.plugins.plugins,
      intl: state.intl
    };
  },
  dispatch => {
    return {dispatch};
  }
)(_RouteSwitcher);
export default withRouter(RouteSwitcher);
