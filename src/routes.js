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
    <Route key="pluginList" path="/plugins" component={PluginList} />
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
  }
  processPlugins() {
    // add new routes
    this.routes = coreRoutes().concat(pluginRegistry.getArrayRoutes());
    // add new components.
    let pluginComponents = pluginRegistry.getRegisteredComponents();
    for (let pluginComponentName in pluginComponents) {
      let entry = pluginComponents[pluginComponentName];
      this.props.dispatch({
        type: entry.action,
        payload: {
          pluginName: entry.pluginName,
          pluginComponentName: pluginComponentName
        }
      });
    }
    this.props.dispatch(updateMessages(this.props.intl.locale));
    // remove unregistered componments.
    let disabledPluginComponents = pluginRegistry.getUnregisteredComponents();
    for (let pluginComponentName in disabledPluginComponents) {
      let entry = disabledPluginComponents[pluginComponentName];
      this.props.dispatch({
        type: entry.action,
        payload: {
          pluginName: entry.pluginName,
          pluginComponentName: pluginComponentName
        }
      });
    }
  }
  componentDidMount() {
    this.processPlugins();
  }
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.plugins) !== JSON.stringify(nextProps.plugins)
    ) {
      this.processPlugins();
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
    return {plugins: state.plugins.plugins, intl: state.intl};
  },
  dispatch => {
    return {dispatch: dispatch};
  }
)(_RouteSwitcher);
export default withRouter(RouteSwitcher);
