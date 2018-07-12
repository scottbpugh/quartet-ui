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
import {TreeNode} from "components/layouts/elements/TreeNode";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {pluginRegistry} from "plugins/pluginRegistration";
import {FormattedMessage} from "react-intl";
import {LocationsNav} from "./LocationsNav";
import {CompaniesNav} from "./CompaniesNav";
import {TradeItemsNav} from "./TradeItemsNav";

class _MasterDataNav extends Component {
  serverHasMasterData() {
    return pluginRegistry
      .getServer(this.props.serverID)
      .appList.includes("masterdata");
  }

  static get PLUGIN_COMPONENT_NAME() {
    return "MasterDataNav";
  }

  render() {
    const {serverID, server} = this.props;
    if (this.serverHasMasterData()) {
      return (
        <TreeNode
          depth={this.props.depth}
          nodeType="masterdata"
          onContextMenu={e => {}}
          childrenNodes={[
            <LocationsNav
              key="locations"
              serverID={serverID}
              server={server}
            />,
            <CompaniesNav
              key="companies"
              serverID={serverID}
              server={server}
            />,
            <TradeItemsNav
              key="tradeItems"
              serverID={serverID}
              server={server}
            />
          ]}>
          <FormattedMessage id="plugins.masterData.masterDataNav" />
        </TreeNode>
      );
    }
    return (
      <TreeNode depth={this.props.depth} childrenNodes={[]}>
        <i>
          <FormattedMessage id="plugins.masterData.noMasterDataFound" />
        </i>
      </TreeNode>
    );
  }
}

export const MasterDataNav = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.serverID],
    currentPath: state.layout.currentPath
  };
}, {})(withRouter(_MasterDataNav));
