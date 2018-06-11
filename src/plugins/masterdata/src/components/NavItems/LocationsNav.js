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
import {FormattedMessage} from "react-intl";
import {TreeNode} from "components/layouts/elements/TreeNode";
import {Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import {withRouter} from "react-router-dom";
import {pluginRegistry} from "plugins/pluginRegistration";

class _LocationsNav extends Component {
  goTo = path => {
    this.props.history.push(path);
  };
  renderContextMenu = () => {
    const {server} = this.props;
    return (
      <Menu>
        <MenuDivider title={`${server.serverSettingName}`} />
        <MenuDivider />
        <MenuItem
          text={pluginRegistry
            .getIntl()
            .formatMessage({id: "plugins.masterData.addLocation"})}
          onClick={this.goTo.bind(
            this,
            `/masterdata/add-location/${server.serverID}`
          )}
        />
      </Menu>
    );
  };
  render() {
    return (
      <TreeNode
        depth={this.props.depth}
        onContextMenu={this.renderContextMenu}
        serverID={this.props.serverID}
        server={this.props.server}
        path={`/masterdata/locations/${this.props.serverID}`}
        childrenNodes={[]}>
        <FormattedMessage id="plugins.masterData.locations" />
      </TreeNode>
    );
  }
}

export const LocationsNav = withRouter(_LocationsNav);
