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
import {withRouter} from "react-router-dom";
import {Tree} from "@blueprintjs/core";
import PropTypes from "prop-types";

class _NRTree extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {tree: this.getTree(props)};
  }
  getTree(props) {
    let nr = props.nr;
    let treeContents = Object.keys(nr).map(key => {
      let children = nr[key].pools.map(pool => {
        return {
          key: pool.machine_name,
          label: pool.readable_name,
          childType: "pool",
          path: `/number-range/region-detail/${nr[key].server.serverID}/${
            pool.machine_name
          }`
        };
      });
      return {
        key: nr[key].server.serverID,
        label: nr[key].server.serverSettingName,
        childNodes: children,
        childType: "server"
      };
    });
    return treeContents;
  }
  componentWillReceiveProps(nextProps) {
    this.setState({tree: this.getTree(nextProps)});
  }
  render() {
    return (
      <Tree
        contents={this.state.tree}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
        onNodeClick={this.handleClick.bind(this)}
      />
    );
  }
  handleClick = nodeData => {
    if (nodeData.path) {
      this.props.history.push(nodeData.path);
    } else {
      this.handleNodeToggle(nodeData);
    }
  };
  handleNodeToggle = nodeData => {
    if (nodeData.isExpanded) {
      this.handleNodeCollapse(nodeData);
    } else {
      this.handleNodeExpand(nodeData);
    }
  };
  handleNodeCollapse = nodeData => {
    nodeData.isExpanded = false;
    this.setState({...this.state});
  };

  handleNodeExpand = nodeData => {
    nodeData.isExpanded = true;
    this.setState({...this.state});
  };
}

export default withRouter(_NRTree);
