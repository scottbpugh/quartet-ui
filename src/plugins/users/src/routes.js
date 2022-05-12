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
import {UsersList} from "./components/Lists/UsersList";
import {GroupsList} from "./components/Lists/GroupsList";
import {AddUser} from "./components/Forms/UsersForm";
import {AddGroup} from "./components/Forms/GroupsForm";
const React = qu4rtet.require("react");
const {Route} = qu4rtet.require("react-router");

export default (() => {
  return [
    <Route
      key="usersList"
      path="/users/:serverID/users"
      component={UsersList}
    />,
    <Route
      key="groupsList"
      path="/users/:serverID/groups"
      component={GroupsList}
    />,
    <Route
      key="addUser"
      path="/users/:serverID/add-user"
      component={AddUser}
    />,
    <Route
      key="addGroup"
      path="/users/:serverID/add-group"
      component={AddGroup}
    />
  ];
})();
