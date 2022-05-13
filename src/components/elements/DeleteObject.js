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
import {DeleteDialog} from "./DeleteDialog";
import {Button} from "@blueprintjs/core";
import {pluginRegistry} from "plugins/pluginRegistration";
import {showMessage} from "lib/message";
import PropTypes from "prop-types";

export class DeleteObject extends Component {
  static propTypes = {
    entry: PropTypes.object.isRequired,
    server: PropTypes.object.isRequired,
    title: PropTypes.element.isRequired,
    body: PropTypes.element.isRequired,
    operationId: PropTypes.string.isRequired,
    postDeleteAction: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      isConfirmDialogOpen: false
    };
  }
  toggleConfirmDialog = () => {
    this.setState({isConfirmDialogOpen: !this.state.isConfirmDialogOpen});
  };
  deleteEntry = async () => {
    if (this.props.entry && this.props.operationId) {
      try {
        let response = await pluginRegistry
          .getServer(this.props.server.serverID)
          .deleteObject(this.props.operationId, this.props.entry);
        showMessage({
          id: "app.common.objectDeletedSuccessfully",
          type: "success"
        });
        if (this.props.postDeleteAction) {
          this.props.postDeleteAction(this.props.server);
        }
      } catch (e) {
        if (e.name === "OperationNotFoundError" || e.status === 403) {
          pluginRegistry.getHistory().push("/access-denied");
          return;
        }
        showMessage({
          id: "app.common.errorDeletingObject",
          values: {error: e},
          type: "error"
        });
      }
    }
  };
  render() {
    const {entry, operationId, title, body} = this.props;
    return (
      <div style={{textAlign: "center"}}>
        <Button
          onClick={this.toggleConfirmDialog.bind(this)}
          iconName="trash"
        />
        <DeleteDialog
          isOpen={this.state.isConfirmDialogOpen}
          title={title}
          body={body}
          toggle={this.toggleConfirmDialog.bind(this)}
          deleteAction={this.deleteEntry.bind(this)}
        />
      </div>
    );
  }
}
