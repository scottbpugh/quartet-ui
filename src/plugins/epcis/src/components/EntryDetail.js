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
import {FormattedMessage, FormattedDate, FormattedTime} from "react-intl";
import {Card} from "@blueprintjs/core";
import {RightPanel} from "components/layouts/Panels";
import {connect} from "react-redux";
import {loadEntry} from "../reducers/epcis";
import {EventDetailTable} from "./EventDetailTable";

import "./EntryDetail.css";

class _EntryDetail extends Component {
  componentDidMount() {
    this.props.loadEntry(this.props.server, this.props.match.params.entryID);
  }

  render() {
    let {currentEntryEvents} = this.props;
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.epcis.entryDetail"
            defaultMessage="Entry Detail"
          />
        }>
        <div className="large-cards-container full-large">
          <Card>
            <h5>{this.props.match.params.entryID}</h5>
            {currentEntryEvents && currentEntryEvents.events
              ? currentEntryEvents.events.map(event => {
                  return (
                    <EventDetailTable
                      className="entry-events-container"
                      currentEntry={event}
                    />
                  );
                })
              : null}
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const EntryDetail = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      currentEntryEvents:
        state.epcis.servers &&
        state.epcis.servers[ownProps.match.params.serverID].detailItems
          ? state.epcis.servers[ownProps.match.params.serverID].detailItems[
              ownProps.match.params.entryID
            ]
          : null
    };
  },
  {loadEntry}
)(_EntryDetail);
