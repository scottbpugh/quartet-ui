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
import {Menu, MenuItem, Popover, Position,  Button} from "@blueprintjs/core";
import classNames from "classnames";
import {FormattedMessage} from "react-intl";

export class AddServerButton extends Component {
  goTo(path) {
    this.props.history.push(path);
  }

  render() {
    const addMenu = (
      <Menu
        className={classNames({
          "menu-padding-fix": true
        })}
      >
        <MenuItem
          text={<FormattedMessage id="app.serverSettings.addAServer" />}
          onClick={this.goTo.bind(this, "/server-settings/")}
        />
        <MenuItem
          text={<FormattedMessage id="app.plugins.addPlugin" />}
          onClick={this.goTo.bind(this, "/plugins")}
        />
      </Menu>
    );
    return (
      <div>
        <Popover
          className={classNames({"bp3-dark": this.props.isDark})}
          content={addMenu}
          position={Position.RIGHT_CENTER}
        >
          <Button
            onClick={this.displayMenu}
            tabIndex="0"
            className="bp3-button"
            icon="add"
          >
            {/*
              <FormattedMessage
                id="plugins.numberRange.addServer"
                defaultMessage="Add a New Server"
              /> */}
          </Button>
        </Popover>
      </div>
    );
  }
}
