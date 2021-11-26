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
let currentDir = require("path")
  .resolve(__dirname)
  .replace(/\\/g, "\\\\");

export default `
.tree-node-users {
  background-image:url("${currentDir}/images/user.svg");
}
.tree-node-users.tree-node-active {
  background-image:url("${currentDir}/images/user-active.svg");
}
.tree-node-groups {
  background-image:url("${currentDir}/images/group-objects.svg");
}
.tree-node-groups.tree-node-active {
  background-image:url("${currentDir}/images/group-objects-active.svg");
}
.tree-node-user-management {
  background-image:url("${currentDir}/images/crown.svg");
}
.tree-node-user-management.tree-node-active {
  background-image:url("${currentDir}/images/crown-active.svg");
}

`;
