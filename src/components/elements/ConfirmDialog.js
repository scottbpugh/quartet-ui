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
 *    <ConfirmDialog
          isOpen={this.state.myOpenToggleBool}
          title={
            <FormattedMessage
              id="plugins.numberRange.confirmSomething"
            />
          }
          body={
            <FormattedMessage id="plugins.numberRange.confirmBody" />
          }
          toggle={this.toggleDialog.bind(this)}
          confirmAction={this.doSomething.bind(this)}
        />
 *
 *
 * */
class _ConfirmDialog extends Component {
  render() {
    const {title, body, confirmAction, theme, toggle} = this.props;
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
          <Callout intent={Intent.WARNING}>{body}</Callout>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button
              onClick={confirmAction}
              iconName="warning"
              intent={Intent.WARNING}>
              <FormattedMessage id="app.common.confirm" />
            </Button>
            <Button onClick={toggle}>
              <FormattedMessage id="app.common.cancelConfirm" />
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export const ConfirmDialog = connect((state, ownProps) => {
  return {
    theme: state.layout.theme
  };
}, {})(_ConfirmDialog);

window.qu4rtet.exports("components/elements/ConfirmDialog", this);
