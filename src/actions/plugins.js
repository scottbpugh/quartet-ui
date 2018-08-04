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

import {createAction} from "redux-actions";

export default {
  addToTreeServers: createAction("PLUGINS_ADD_TO_TREE_SERVERS"),
  removeFromTreeServers: createAction("PLUGINS_REMOVE_FROM_TREE_SERVERS"),
  addButtonToControls: createAction("PLUGINS_ADD_BUTTON_TO_CONTROLS"),
  removeButtonFromControls: createAction("PLUGINS_REMOVE_BUTTON_FROM_CONTROLS"),
  pluginEnabled: createAction("PLUGINS_NEW_PLUGIN_ENABLED"),
  pluginDisabled: createAction("PLUGINS_PLUGIN_DISABLED"),
  receivedPluginsData: createAction("PLUGINS_RECEIVED_PLUGINS_DATA"),
  addLocalPlugin: createAction("PLUGINS_ADD_LOCAL_PLUGIN"),
  pluginListUpdated: createAction("PLUGINS_PLUGIN_LIST_UPDATED"),
  resetPlugins: createAction("PLUGINS_RESET_PLUGINS")
};
window.qu4rtet.exports("actions/plugins", this);
