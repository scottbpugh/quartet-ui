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
  ContextMenu,
  RadioGroup,
  Radio
} = qu4rtet.require("@blueprintjs/core");
const {TreeNode} = qu4rtet.require("./components/layouts/elements/TreeNode");
const {withRouter} = qu4rtet.require("react-router");
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

export class _TemplatesNav extends Component {
  goTo = path => {
    return this.props.history.push(path);
  };
  renderContextMenu = () => {
    const {server, serverID, history} = this.props;
    return (
      <Menu>
        <MenuDivider title={server.serverSettingName} />
        <MenuDivider />
        <MenuItem
          onClick={this.goTo.bind(this, `/templates/${serverID}/add-template`)}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.templates.addTemplate"
          })}
        />
      </Menu>
    );
  };
  render() {
    const {serverID, server} = this.props;
    return (
      <TreeNode
        serverID={serverID}
        nodeType="templates"
        onContextMenu={this.renderContextMenu}
        childrenNodes={[]}
        path={`/templates/${this.props.serverID}/templates`}>
        <FormattedMessage id="plugins.templates.templatesNav" />
      </TreeNode>
    );
  }
}

export class _TemplatesNavRoot extends Component {
  static get PLUGIN_COMPONENT_NAME() {
    return "TemplatesNavRoot";
  }
  serverHasTemplates() {
    return pluginRegistry
      .getServer(this.props.serverID)
      .appList.includes("templates");
  }
  goTo = path => {
    this.props.history.push(path);
  };
  renderContextMenu = () => {
    const {server, serverID} = this.props;
    return (
      <Menu>
        <MenuDivider title={server.serverSettingName} />
        <MenuDivider />
      </Menu>
    );
  };
  render() {
    const {serverID, server, history} = this.props;

    if (server && this.serverHasTemplates()) {
      return (
        <TreeNode
          serverID={serverID}
          nodeType="templates"
          onContextMenu={this.renderContextMenu}
          depth={this.props.depth}
          childrenNodes={[
            <_TemplatesNav
              key="TemplatesNav"
              serverID={serverID}
              server={server}
              depth={this.props.depth}
              history={history}
            />
          ]}>
          <FormattedMessage id="plugins.templates.navItemsTitle" />
        </TreeNode>
      );
    } else {
      return (
        <TreeNode depth={this.props.depth} childrenNodes={[]}>
          <i>
            <FormattedMessage id="plugins.templates.noTemplatesFound" />
          </i>
        </TreeNode>
      );
    }
  }
}

export const TemplatesNavRoot = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.serverID],
    currentPath: state.layout.currentPath
  };
}, {})(withRouter(_TemplatesNavRoot));
