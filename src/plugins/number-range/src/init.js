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
import {
  registerComponent,
  unregisterComponent,
  registerRoutes,
  unregisterRoutes,
  pluginRegistry
} from "../../pluginRegistration";
import actions from "../../../actions/plugins";
import {loadPools} from "./reducers/numberrange";
import {NavPluginRoot} from "./components/NavItems";
import routes from "./routes";
import reducer, {initialData} from "./reducers/numberrange";
import messages from "./messages";

const PLUGIN_NAME = "NumberRange";

export const enablePlugin = () => {
  pluginRegistry.registerReducer(
    PLUGIN_NAME,
    "numberrange",
    reducer,
    initialData()
  );
  pluginRegistry.setMessages(messages);
  registerRoutes(PLUGIN_NAME, routes);
  registerComponent(PLUGIN_NAME, NavPluginRoot, actions.addToTreeServers);
};

export const disablePlugin = () => {
  unregisterRoutes(PLUGIN_NAME);
  unregisterComponent(
    PLUGIN_NAME,
    NavPluginRoot,
    actions.removeFromTreeServers
  );
};
