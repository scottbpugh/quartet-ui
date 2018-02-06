// Copyright (c) 2018 Serial Lab
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
import {Tree} from "@blueprintjs/core";

export default class NRTree extends Component {
  constructor(props) {
    super(props);
    this.buildTree(props);
  }
  buildTree(props) {
    let nr = props.nr;
    let treeContents = Object.keys(nr).map(key => {
      let children = nr[key].pools.map(pool => {
        return {
          key: pool.machine_name,
          label: pool.readable_name
        };
      });
      return {
        key: nr[key].server.serverID,
        label: nr[key].server.serverSettingName,
        childNodes: children
      };
    });
    this.state = {tree: treeContents};
  }
  componentWillReceiveProps(nextProps) {
    this.buildTree(nextProps);
  }
  render() {
    return (
      <Tree
        contents={this.state.tree}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
      />
    );
  }
  handleNodeCollapse = nodeData => {
    nodeData.isExpanded = false;
    this.setState({...this.state});
  };

  handleNodeExpand = nodeData => {
    nodeData.isExpanded = true;
    this.setState({...this.state});
  };
}
