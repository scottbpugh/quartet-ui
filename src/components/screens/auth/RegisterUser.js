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
import {connect} from "react-redux";
import {Dialog, Button, Intent} from "@blueprintjs/core";
import {RegisterForm} from "./RegisterForm";
import classNames from "classnames";

export class RegisterUserDialog extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {intl, isOpen, server, theme} = this.props;
    return (
      <Dialog
        iconName="user"
        isOpen={this.props.isOpen}
        onClose={this.props.closeDialog}
        className={classNames({
          "pt-dark": this.props.theme.startsWith("dark") ? true : false
        })}
        title={intl.formatMessage({id: "app.servers.registerUser"})}>
        <div className="pt-dialog-body">
          <RegisterForm isOpen={isOpen} server={server} />
        </div>
      </Dialog>
    );
  }
}
