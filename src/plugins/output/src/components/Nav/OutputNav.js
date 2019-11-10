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

export class _AuthenticationNav extends Component {
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
          onClick={this.goTo.bind(
            this,
            `/output/${serverID}/add-authentication`
          )}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.output.addAuthentication"
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
        childrenNodes={[]}
        nodeType="authentication"
        path={`/output/${this.props.serverID}/authentication`}
        onContextMenu={this.renderContextMenu}>
        <FormattedMessage id="plugins.output.authenticationNav" />
      </TreeNode>
    );
  }
}

export class _EndpointsNav extends Component {
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
          onClick={this.goTo.bind(this, `/output/${serverID}/add-endpoint`)}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.output.addEndpoint"
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
        nodeType="endpoints"
        onContextMenu={this.renderContextMenu}
        childrenNodes={[]}
        path={`/output/${this.props.serverID}/endpoints`}>
        <FormattedMessage id="plugins.output.endpointsNav" />
      </TreeNode>
    );
  }
}

export class _EPCISOutputNav extends Component {
  constructor(props) {
    super(props);
  }
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
          onClick={this.goTo.bind(this, `/output/${serverID}/add-criteria`)}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.output.addEPCISOutputCriteria"
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
        childrenNodes={[]}
        nodeType="epcis-output-criteria"
        path={`/output/${serverID}/epcis-output-criteria`}
        onContextMenu={this.renderContextMenu}>
        <FormattedMessage id="plugins.output.EPCISOutputNav" />
      </TreeNode>
    );
  }
}

export class _OutputNavRoot extends Component {
  static get PLUGIN_COMPONENT_NAME() {
    return "OutputNavRoot";
  }
  serverHasOutput() {
    return pluginRegistry
      .getServer(this.props.serverID)
      .appList.includes("output");
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

    if (server && this.serverHasOutput()) {
      return (
        <TreeNode
          serverID={serverID}
          nodeType="output"
          onContextMenu={this.renderContextMenu}
          depth={this.props.depth}
          childrenNodes={[
            <_EndpointsNav
              key="EndpointsNav"
              serverID={serverID}
              server={server}
              depth={this.props.depth}
              history={history}
            />,
            <_EPCISOutputNav
              key="EPCISOutputNav"
              serverID={serverID}
              server={server}
              depth={this.props.depth}
              history={history}
            />,
            <_AuthenticationNav
              key="AuthNav"
              serverID={serverID}
              server={server}
              depth={this.props.depth}
              history={history}
            />
          ]}>
          <FormattedMessage id="plugins.output.navItemsTitle" />
        </TreeNode>
      );
    } else {
      return (
        <TreeNode depth={this.props.depth} childrenNodes={[]}>
          <i>
            <FormattedMessage id="plugins.output.noOutputFound" />
          </i>
        </TreeNode>
      );
    }
  }
}

export const OutputNavRoot = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.serverID],
    currentPath: state.layout.currentPath
  };
}, {})(withRouter(_OutputNavRoot));
