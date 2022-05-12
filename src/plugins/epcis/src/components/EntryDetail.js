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
import {FormattedMessage} from "react-intl";
import {Card} from "@blueprintjs/core";
import {RightPanel} from "components/layouts/Panels";
import {connect} from "react-redux";
import {loadEntry, getGeoForEntry} from "../reducers/epcis";
import {EventDetailTable} from "./EventDetailTable";
import {EventsTimeline} from "./EventsTimeline";
import {MapBody} from "./MapBody";

import "./EntryDetail.css";

class _EntryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {geoEvents: []};
  }

  componentDidMount() {
    this.setState({
      geoEvents: this.props.geoEvents ? this.props.geoEvents : []
    });
    this.props.loadEntry(this.props.server, this.props.match.params.entryID);
    this.props.getGeoForEntry(
      this.props.server,
      this.props.match.params.entryID
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.geoEvents) {
      this.setState({geoEvents: nextProps.geoEvents});
    }
  }

  render() {
    const {currentEntryEvents, server} = this.props;
    return (
      <RightPanel
        title={(
          <FormattedMessage
            id="plugins.epcis.entryDetail"
            defaultMessage="Entry Detail"
          />
)}
      >
        <div className="large-cards-container full-large">
          <Card>
            <h5 className="bp3-heading">
              {this.props.match.params.entryID}
            </h5>
            {currentEntryEvents && currentEntryEvents.events ? (
              <div>
                <EventsTimeline events={currentEntryEvents.events} />
                {this.state.geoEvents.length > 0 ? (
                  <MapBody geoEvents={this.state.geoEvents} />
                ) : null}
                <br />
                {currentEntryEvents.events.map(event => {
                  return (
                    <EventDetailTable
                      className="entry-events-container"
                      currentEntry={event}
                      history={this.props.history}
                      serverID={server.serverID}
                    />
                  );
                })}
              </div>
            ) : null}
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const EntryDetail = connect(
  (state, ownProps) => {
    const hasProp = propName => {
      return (
        state.epcis.servers
        && state.epcis.servers[ownProps.match.params.serverID]
        && state.epcis.servers[ownProps.match.params.serverID][propName]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      geoEvents: hasProp("geoEvents")
        ? state.epcis.servers[ownProps.match.params.serverID].geoEvents
        : [],
      currentEntryEvents: hasProp("detailItems")
        ? state.epcis.servers[ownProps.match.params.serverID].detailItems[
          ownProps.match.params.entryID
        ]
        : null
    };
  },
  {loadEntry, getGeoForEntry}
)(_EntryDetail);
