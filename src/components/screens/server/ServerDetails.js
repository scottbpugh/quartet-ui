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
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {saveServer} from "reducers/serversettings";

class _ServerDetails extends Component {
  componentDidMount() {
    console.log("current server", this.props.match.params.serverID);
  }
  componentWillReceiveProps(nextProps) {
    console.log("current server", this.props.server, nextProps.server);
    console.log("next server", nextProps.match.params.serverID);
  }
  render() {
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="nav.app.serverDetails"
            defaultMessage="Server Details"
          />
        }
      />
    );
  }
}

export var ServerDetails = connect(
  (state, ownProps) => ({
    server: state.serversettings.servers[ownProps.match.params.serverID]
  }),
  {
    saveServer
  }
)(_ServerDetails);
