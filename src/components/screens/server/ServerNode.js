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
import {injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {RegisterUserDialog} from "components/screens/auth/RegisterUserDialog";
import {ServerMenu} from "./ServerMenu";
import {TreeNode} from "components/layouts/elements/NavTree";
import {VerifyUserDialog} from "components/screens/auth/VerifyUserDialog";
import {DeleteDialog} from "components/elements/DeleteDialog";
import {FormattedMessage} from "react-intl";
import {deleteServer} from "reducers/serversettings";
import {ContextMenu} from "@blueprintjs/core";

class _ServerNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      registerDialogOpen: false,
      verifyDialogOpen: false,
      confirmDeleteOpen: false
    };
  }
  componentDidMount() {
    this.activateNode(this.props.currentPath, this.props.server);
  }
  componentWillReceiveProps(nextProps) {
    this.activateNode(nextProps.currentPath, nextProps.server);
  }
  renderContextMenu() {
    const {server, intl} = this.props;
    return (
      <ServerMenu
        toggleRegisterDialog={this.toggleRegisterDialog}
        toggleVerifyDialog={this.toggleVerifyDialog}
        toggleConfirmDelete={this.toggleConfirmDelete}
        intl={intl}
        server={server}
      />
    );
  }
  toggleRegisterDialog = () => {
    this.setState({registerDialogOpen: !this.state.registerDialogOpen});
  };
  toggleVerifyDialog = () => {
    this.setState({verifyDialogOpen: !this.state.verifyDialogOpen});
  };
  toggleConfirmDelete = () => {
    this.setState({confirmDeleteOpen: !this.state.confirmDeleteOpen});
  };
  trashServer = () => {
    this.toggleConfirmDelete();
    ContextMenu.hide();
    this.props.history.push("/");
    this.props.deleteServer(this.props.server);
  };
  activateNode(currentPath, server) {
    // set active state if in current path.
    // for some reason this.props.location.pathname doesn't get updated.
    // window.location.pathname does.
    const {serverID} = server;
    let regexp = new RegExp(`${serverID}`);
    this.setState({active: regexp.test(currentPath)}, () => {});
  }
  render() {
    const {server, intl, childrenNodes, children} = this.props;
    return (
      <TreeNode
        key={server.serverID}
        onContextMenu={this.renderContextMenu.bind(this)}
        nodeType="server"
        depth={0}
        path={`/server-details/${server.serverID}`}
        active={this.state.active}
        childrenNodes={childrenNodes ? childrenNodes : []}>
        {children}
        <RegisterUserDialog
          intl={intl}
          server={server}
          closeDialog={this.toggleRegisterDialog.bind(this)}
          isOpen={this.state.registerDialogOpen}
          theme={this.props.theme}
        />
        <VerifyUserDialog
          intl={intl}
          server={server}
          closeDialog={this.toggleVerifyDialog.bind(this)}
          isOpen={this.state.verifyDialogOpen}
          theme={this.props.theme}
        />
        <DeleteDialog
          isOpen={this.state.confirmDeleteOpen}
          title={
            <FormattedMessage
              id="app.servers.deleteServer"
              values={{serverName: server.serverSettingName}}
            />
          }
          body={<FormattedMessage id="app.servers.deleteServerConfirm" />}
          toggle={this.toggleConfirmDelete.bind(this)}
          deleteAction={this.trashServer.bind(this)}
        />
      </TreeNode>
    );
  }
}

export const ServerNode = connect(
  (state, ownProps) => {
    return {
      currentPath: state.layout.currentPath,
      theme: state.layout.theme
    };
  },
  {deleteServer}
)(injectIntl(withRouter(_ServerNode)));
