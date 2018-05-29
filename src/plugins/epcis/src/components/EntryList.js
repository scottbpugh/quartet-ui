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
import {FormattedMessage} from "react-intl";
import {ServerEntries} from "./ServerEntries";
import {withRouter} from "react-router";

import "./EntryList.css";

class _EntryList extends Component {
  render() {
    let {server, entries, loadEntries, count, next} = this.props;
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.epcis.entryList"
            defaultMessage="Entries"
          />
        }>
        <div className="large-cards-container full-large">
          <ServerEntries
            history={this.props.history}
            loadEntries={loadEntries}
            server={server}
            entries={entries}
            count={count}
            next={next}
          />
        </div>
      </RightPanel>
    );
  }
}

export const EntryList = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.epcis.servers &&
        state.epcis.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      entries: isServerSet()
        ? state.epcis.servers[ownProps.match.params.serverID].entries
        : [],
      count: isServerSet()
        ? state.epcis.servers[ownProps.match.params.serverID].count
        : 0,
      next: isServerSet()
        ? state.epcis.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadEntries}
)(withRouter(_EntryList));
