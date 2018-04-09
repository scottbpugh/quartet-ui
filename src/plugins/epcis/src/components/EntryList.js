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
import {RightPanel} from "components/layouts/Panels";
import {loadEntries} from "../reducers/epcis";
import {Card, Tag, Intent} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {pluginRegistry} from "plugins/pluginRegistration";
import "./EntryList.css";

class _EntryList extends Component {
  constructor(props) {
    super(props);
    this.fetchEntries = null;
  }
  componentDidMount() {
    const {server} = this.props;
    this.props.loadEntries(pluginRegistry.getServer(server.serverID));
    this.fetchEntries = setInterval(() => {
      this.props.loadEntries(pluginRegistry.getServer(server.serverID));
    }, 5000);
    this.props.loadEntries(pluginRegistry.getServer(server.serverID));
  }
  componentWillUnmount() {
    clearInterval(this.fetchEntries);
    this.fetchEntries = null;
  }
  render() {
    let {server, entries} = this.props;
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.epcis.entryList"
            defaultMessage="Entries"
          />
        }>
        <div className="large-cards-container full-large">
          <Card />
          <Card />
        </div>
      </RightPanel>
    );
  }
}

export const EntryList = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      entries: state.epcis.servers
        ? state.epcis.servers[ownProps.match.params.serverID].entries
        : []
    };
  },
  {loadEntries}
)(_EntryList);
