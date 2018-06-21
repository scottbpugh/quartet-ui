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
import {FormattedMessage, FormattedDate, FormattedTime} from "react-intl";
import {PaginatedList} from "components/elements/PaginatedList";
import {withRouter} from "react-router";
import {Icon, Intent} from "@blueprintjs/core";

const EventTableHeader = props => (
  <thead>
    <tr>
      <th>
        <FormattedMessage id="plugins.epcis.detail" defaultMessage="Detail" />
      </th>
      <th>
        <FormattedMessage
          id="plugins.epcis.eventTime"
          defaultMessage="Event Time"
        />
      </th>
      <th>
        <FormattedMessage
          id="plugins.epcis.recordTime"
          defaultMessage="Record Time"
        />
      </th>
      <th>
        <FormattedMessage id="plugins.epcis.type" defaultMessage="Event Type" />
      </th>
      <th>
        <FormattedMessage
          id="plugins.epcis.bizStep"
          defaultMessage="Business Step"
        />
      </th>
      <th>
        <FormattedMessage
          id="plugins.epcis.disposition"
          defaultMessage="Disposition"
        />
      </th>
      <th>
        <FormattedMessage id="plugins.epcis.action" defaultMessage="Action" />
      </th>
      <th>
        <FormattedMessage
          id="plugins.epcis.readPoint"
          defaultMessage="Read Point"
        />
      </th>
    </tr>
  </thead>
);

const EventEntry = props => {
  const goTo = path => {
    props.history.push(path);
  };

  const getEventType = type => {
    switch (type) {
      case "ag":
        return (
          <FormattedMessage
            id="plugins.epcis.aggregationEvent"
            defaultMessage="Aggregation Event"
          />
        );
      case "ob":
        return (
          <FormattedMessage
            id="plugins.epcis.objectEvent"
            defaultMessage="Object Event"
          />
        );
      case "tx":
        return (
          <FormattedMessage
            id="plugins.epcis.transactionEvent"
            defaultMessage="Transaction Event"
          />
        );
      case "tf":
        return (
          <FormattedMessage
            id="plugins.epcis.transformationEvent"
            defaultMessage="Transformation Event"
          />
        );
      default:
        return (
          <FormattedMessage id="plugins.epcis.event" defaultMessage="Event" />
        );
    }
  };
  return (
    <tr
      onClick={goTo.bind(
        this,
        `/epcis/event-detail/${props.server.serverID}/uuid/${props.entry.id}`
      )}
      key={props.entry.id}>
      <td
        style={{
          align: "center",
          textAlign: "center",
          verticalAlign: "middle"
        }}>
        <Icon intent={Intent.PRIMARY} iconName="search-template" />
      </td>
      <td>
        <FormattedDate value={props.entry.event_time} />{" "}
        <FormattedTime value={props.entry.event_time} />
      </td>
      <td>
        {" "}
        <FormattedDate value={props.entry.record_time} />{" "}
        <FormattedTime value={props.entry.record_time} />
      </td>
      <td>{getEventType(props.entry.type)}</td>
      <td>{props.entry.biz_step}</td>
      <td>{props.entry.disposition}</td>
      <td>{props.entry.action}</td>
      <td>{props.entry.read_point}</td>
    </tr>
  );
};

class _EventList extends Component {
  constructor(props) {
    super(props);
    this.fetchEvents = null;
    this.eventType = null;
  }
  componentDidMount() {
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
          <PaginatedList
            loadEntries={loadEvents}
            tableHeaderClass={EventTableHeader}
            entryClass={EventEntry}
            server={server}
            entries={events}
            count={count}
            next={next}
            type={this.eventType}
          />
        </div>
      </RightPanel>
    );
  }
}

export const EventList = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.epcis.servers &&
        state.epcis.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      events: isServerSet()
        ? state.epcis.servers[ownProps.match.params.serverID].events
        : [],
      count: isServerSet()
        ? state.epcis.servers[ownProps.match.params.serverID].count
        : 0,
      next: isServerSet()
        ? state.epcis.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadEvents}
)(withRouter(_EventList));
