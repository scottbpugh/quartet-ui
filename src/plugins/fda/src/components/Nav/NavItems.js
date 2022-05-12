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

const React = qu4rtet.require("react");

const {Component} = React;
const {
  Menu,
  MenuItem,
  MenuDivider,
  Dialog,
  Button,
  ButtonGroup,
  ContextMenu
} = qu4rtet.require("@blueprintjs/core");
const {TreeNode} = qu4rtet.require("./components/layouts/elements/TreeNode");
const {withRouter} = qu4rtet.require("react-router");
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

class SubMenu extends Component {
  render() {
    return (
      <TreeNode
        serverID={this.props.serverID}
        nodeType="thumbup"
        depth={this.props.depth}
        childrenNodes={[]}>
        <FormattedMessage id="plugins.boilerplate.subNavItem" />
      </TreeNode>
    );
  }
}

export class _NavRoot extends Component {
  // This static method is important
  // for the component to be properly registered
  static get PLUGIN_COMPONENT_NAME() {
    return "FDALookupRoot";
  }

  serverHasService() {
    // you may check here a service is available in the app list.
    // example to check if the output QU4RTET backend module is enabled:
    // return pluginRegistry
    //  .getServer(this.props.serverID)
    //  .appList.includes("output");

    // for now we just return true.
    return true;
  }

  goTo = path => {
    // logic can be added here for link clicks.
    this.props.history.push(path);
  };

  renderContextMenu = () => {
    // The Context menu is displayed on right click.
    const {server} = this.props;
    return (
      <Menu>
        <MenuDivider title={server.serverSettingName} />
        <MenuDivider />
        <MenuItem
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.boilerplate.menuLink1"
          })}
        />
      </Menu>
    );
  };

  render() {
    const {serverID, server, history} = this.props;

    if (server && this.serverHasService()) {
      return (
        <TreeNode
          depth={this.props.depth}
          childrenNodes={[]}
          nodeType="fda-lookup"
          path={`/fda/${serverID}/lookup`}>
          <FormattedMessage id="plugins.fda.FDALookup" />
        </TreeNode>
      );
    } else {
      return null;
    }
  }
}

export const NavRoot = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.serverID],
    currentPath: state.layout.currentPath
  };
}, {})(withRouter(_NavRoot));
