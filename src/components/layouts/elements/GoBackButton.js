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
import {Button} from "@blueprintjs/core";
import {pluginRegistry} from "plugins/pluginRegistration";

export class GoBackButton extends Component {
  constructor(props) {
    super(props);
    this.state = {backAllowed: false};
  }
  componentWillReceiveProps(nextProps) {
    this.setState({backAllowed: nextProps.currentPath !== "/"});
  }

  render() {
    return (
      <div>
        <Button
          onClick={e => {
            if (this.state.backAllowed) {
              this.props.history.goBack();
            }
          }}
          icon="arrow-left"
          tabIndex="0"
          disabled={!this.state.backAllowed}
          className="bp3-button"
          title={pluginRegistry
            .getIntl()
            .formatMessage({id: "app.common.backButton"})}>
          {/*
              <FormattedMessage
                id="plugins.numberRange.addServer"
                defaultMessage="Add a New Server"
              /> */}
        </Button>
      </div>
    );
  }
}
