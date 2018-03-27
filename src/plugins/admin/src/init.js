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

import {pluginRegistry} from "plugins/pluginRegistration";
import actions from "actions/plugins";
import {NavPluginRoot} from "./components/NavItems";
import routes from "./routes";
import reducer, {initialData} from "./reducers/admin";
import messages from "./messages";

const PLUGIN_NAME = "Admin";

export const enablePlugin = () => {
  pluginRegistry.registerReducer(PLUGIN_NAME, "admin", reducer, initialData());
  pluginRegistry.setMessages(messages);
  console.log("routes", routes);
  pluginRegistry.registerRoutes(PLUGIN_NAME, routes);
  pluginRegistry.registerComponent(
    PLUGIN_NAME,
    NavPluginRoot,
    actions.addToTreeServers
  );
};

export const disablePlugin = () => {
  pluginRegistry.unregisterRoutes(PLUGIN_NAME);
  pluginRegistry.unregisterComponent(
    PLUGIN_NAME,
    NavPluginRoot,
    actions.removeFromTreeServers
  );
};
