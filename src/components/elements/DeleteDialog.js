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
import {Callout, Intent, Button, Dialog} from "@blueprintjs/core";
import classNames from "classnames";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";

/**
 *
 *
 *  Instantiate as follows, here the region example:
 *    <DeleteDialog
          isOpen={this.state.myOpenToggleBool}
          title={
            <FormattedMessage
              id="plugins.numberRange.deleteRegion"
              values={{regionName: region.readable_name}}
            />
          }
          body={
            <FormattedMessage id="plugins.numberRange.deleteRegionConfirm" />
          }
          toggle={this.toggleDialog.bind(this)}
          deleteAction={this.trashRegion.bind(this)}
        />
 *
 *
 * */
class _DeleteDialog extends Component {
  render() {
    const {title, body, deleteAction, theme, toggle} = this.props;
    return (
      <Dialog
        className={classNames({
          "pt-dark": theme.includes("dark")
        })}
        isOpen={this.props.isOpen}
        onClose={toggle}>
        <div className="pt-dialog-header">
          <h5>{title}</h5>
        </div>
        <div className="pt-dialog-body">
          <Callout intent={Intent.DANGER}>{body}</Callout>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button
              onClick={deleteAction}
              iconName="trash"
              intent={Intent.DANGER}>
              <FormattedMessage id="app.common.deleteButton" />
            </Button>
            <Button onClick={toggle}>
              <FormattedMessage id="app.common.cancelDelete" />
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export const DeleteDialog = connect((state, ownProps) => {
  return {
    theme: state.layout.theme
  };
}, {})(_DeleteDialog);

window.qu4rtet.exports("components/elements/DeleteDialog", this);
