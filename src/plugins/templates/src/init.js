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
import {TemplatesNavRoot} from "./components/Nav/TemplatesNav";
import messages from "./messages";
import routes from "./routes";
const actions = qu4rtet.require("./actions/plugins").default;
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const reducer = require("./reducers/templates").default;
const {initialData} = require("./reducers/output");

const PLUGIN_NAME = "Templates";

var fs = require("fs");

export const enablePlugin = () => {
  pluginRegistry.registerReducer(PLUGIN_NAME, "templates", reducer);
  pluginRegistry.registerRoutes(PLUGIN_NAME, routes);
  pluginRegistry.setMessages(messages);
  pluginRegistry.registerCss(PLUGIN_NAME, require("./styles.js").default);
  pluginRegistry.registerComponent(
    PLUGIN_NAME,
    TemplatesNavRoot,
    actions.addToTreeServers
  );
};

export const disablePlugin = () => {
  pluginRegistry.unregisterRoutes(PLUGIN_NAME);
  pluginRegistry.unregisterComponent(
    PLUGIN_NAME,
    TemplatesNavRoot,
    actions.removeFromTreeServers
  );
  pluginRegistry.unregisterCss(PLUGIN_NAME);
};
