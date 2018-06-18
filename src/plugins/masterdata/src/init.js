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
import reducer, {initialData} from "./reducers/masterdata";
import actions from "actions/plugins";
import {MasterDataNav} from "./components/NavItems/MasterDataNav";
import messages from "./messages";
import routes from "./routes";

const PLUGIN_NAME = "MasterData";

export const enablePlugin = () => {
  pluginRegistry.registerReducer(
    PLUGIN_NAME,
    "masterdata",
    reducer,
    initialData()
  );
  pluginRegistry.setMessages(messages);
  pluginRegistry.registerRoutes(PLUGIN_NAME, routes);
  pluginRegistry.registerComponent(
    PLUGIN_NAME,
    MasterDataNav,
    actions.addToTreeServers
  );
};

export const disablePlugin = () => {
  pluginRegistry.unregisterRoutes(PLUGIN_NAME);
  pluginRegistry.unregisterComponent(
    PLUGIN_NAME,
    MasterDataNav,
    actions.removeFromTreeServers
  );
};
