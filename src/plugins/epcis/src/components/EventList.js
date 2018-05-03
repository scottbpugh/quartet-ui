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
import {loadEvents} from "../reducers/epcis";
import {FormattedMessage} from "react-intl";
import {pluginRegistry} from "plugins/pluginRegistration";
import {ServerEvents} from "./ServerEvents";
import {withRouter} from "react-router";

class _EventList extends Component {
  constructor(props) {
    super(props);
    this.fetchEvents = null;
    this.eventType = null;
  }
  componentDidMount() {
    const {server} = this.props;
    if (this.props.match.params.eventType) {
      this.eventType = this.props.match.params.eventType;
    }
  }
  componentWillUnmount() {
    clearInterval(this.fetchEvents);
    this.fetchEvents = null;
  }
  render() {
    let {server, events, loadEvents, count, next} = this.props;
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.epcis.eventList"
            defaultMessage="Events"
          />
        }>
        <div className="large-cards-container full-large">
          <ServerEvents
            loadEvents={loadEvents}
            server={server}
            events={events}
            count={count}
            next={next}
          />
        </div>
      </RightPanel>
    );
  }
}

export const EventList = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      events: state.epcis.servers
        ? state.epcis.servers[ownProps.match.params.serverID].events
        : [],
      count: state.epcis.servers
        ? state.epcis.servers[ownProps.match.params.serverID].count
        : 0,
      next: state.epcis.servers
        ? state.epcis.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadEvents}
)(withRouter(_EventList));
