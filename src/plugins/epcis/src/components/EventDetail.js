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
import {RightPanel} from "components/layouts/Panels";
import {connect} from "react-redux";
import {loadEvent} from "../reducers/epcis";
import {EventDetailTable} from "./EventDetailTable";

import "./EventDetail.css";

class _EventDetail extends Component {
  componentDidMount() {
    this.props.loadEvent(this.props.server, this.props.match.params.eventID);
  }
  componentWillReceiveProps(nextProps) {
    /*nextProps.loadEvent(nextProps.server, nextProps.match.params.eventID);*/
  }
  getObjectType = currentEntry => {
    try {
      let key = Object.keys(currentEntry);
      return key[0];
    } catch (e) {
      return null;
    }
  };
  getObjectTypeDisplay = objectType => {
    switch (objectType) {
      case "aggregationEvent":
        return (
          <FormattedMessage
            id="plugins.epcis.aggregationEvent"
            defaultMessage="Aggregation Event"
          />
        );
      case "objectEvent":
        return (
          <FormattedMessage
            id="plugins.epcis.objectEvent"
            defaultMessage="Object Event"
          />
        );
      case "transactionEvent":
        return (
          <FormattedMessage
            id="plugins.epcis.transactionEvent"
            defaultMessage="Transaction Event"
          />
        );
      case "transformationEvent":
        return (
          <FormattedMessage
            id="plugins.epcis.transformationEvent"
            defaultMessage="Transformation Event"
          />
        );
      default:
        return null;
    }
  };
  render() {
    let {server, currentEntry} = this.props;

    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.epcis.eventDetail"
            defaultMessage="Event Detail"
          />
        }>
        <div>
          <EventDetailTable
            className="w4-container large-cards-container no-header"
            serverID={server.serverID}
            currentEntry={currentEntry}
            history={this.props.history}
          />
        </div>
      </RightPanel>
    );
  }
}

export const EventDetail = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      currentEntry:
        state.epcis.servers &&
        state.epcis.servers[ownProps.match.params.serverID].detailItems
          ? state.epcis.servers[ownProps.match.params.serverID].detailItems[
              ownProps.match.params.eventID
            ]
          : {}
    };
  },
  {loadEvent}
)(_EventDetail);
