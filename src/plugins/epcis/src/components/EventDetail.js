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
import {
  Card,
  Tag,
  ControlGroup,
  Button,
  InputGroup,
  Intent,
  Icon
} from "@blueprintjs/core";
import {FormattedMessage, FormattedDate, FormattedTime} from "react-intl";
import {RightPanel} from "components/layouts/Panels";
import {connect} from "react-redux";
import {loadEvent} from "../reducers/epcis";
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
    let {server, events, currentEntry} = this.props;
    let objectType = this.getObjectType(currentEntry);
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.epcis.eventDetail"
            defaultMessage="Event Detail"
          />
        }>
        {currentEntry && currentEntry[objectType] ? (
          <div className="w4-container large-cards-container no-header">
            <Card className="pt-elevation-4">
              <div className="what">
                <div className="question-left">What</div>
                <div className="detail-table-container">
                  <table className="pt-table pt-bordered pt-striped">
                    <tbody>
                      <tr>
                        <td>Event Type</td>
                        <td>{this.getObjectTypeDisplay(objectType)}</td>
                      </tr>
                      <tr>
                        <td>EPC List</td>
                        <td>
                          <div
                            style={{overflowY: "scroll", maxHeight: "400px"}}>
                            <ul className="w4-list float">
                              {currentEntry[objectType].epc_list
                                ? currentEntry[objectType].epc_list.map(epc => {
                                    return (
                                      <li>
                                        <Tag intent={Intent.PRIMARY}>{epc}</Tag>
                                      </li>
                                    );
                                  })
                                : null}
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>ILMD</td>
                        <td>
                          <ul className="w4-list">
                            {currentEntry[objectType].ilmd
                              ? Object.keys(currentEntry[objectType].ilmd).map(
                                  key => {
                                    return (
                                      <li>
                                        {key}:{" "}
                                        {currentEntry[objectType].ilmd[key]}
                                      </li>
                                    );
                                  }
                                )
                              : null}
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
            <Card className="pt-elevation-4">
              <div className="when">
                <div className="question-left">When</div>
                <div className="detail-table-container" style={{width: "100%"}}>
                  <table className="pt-table pt-bordered pt-striped pt-interactive">
                    <tbody>
                      <tr>
                        <td>Event Time</td>
                        <td>
                          <FormattedDate
                            value={currentEntry[objectType].eventTime}
                          />{" "}
                          <FormattedTime
                            value={currentEntry[objectType].eventTime}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>eventTimezoneOffset</td>
                        <td>{currentEntry[objectType].eventTimezoneOffset}</td>
                      </tr>
                      <tr>
                        <td>Record Time</td>
                        <td>
                          <FormattedDate
                            value={currentEntry[objectType].eventTime}
                          />{" "}
                          <FormattedTime
                            value={currentEntry[objectType].eventTime}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
            <Card className="pt-elevation-4">
              <div className="where">
                <div className="question-left">Where</div>
                <div className="detail-table-container">
                  <table className="pt-table pt-bordered pt-striped">
                    <tbody>
                      <tr>
                        <td>Business Location</td>
                        <td>
                          <Tag intent={Intent.PRIMARY}>
                            {currentEntry[objectType].bizLocation}
                          </Tag>
                        </td>
                      </tr>
                      <tr>
                        <td>Read Point</td>
                        <td>
                          <Tag intent={Intent.PRIMARY}>
                            {currentEntry[objectType].readPoint}
                          </Tag>
                        </td>
                      </tr>
                      <tr>
                        <td>Source List</td>
                        <td>
                          <ul className="w4-list">
                            {currentEntry[objectType] &&
                            currentEntry[objectType].sourceList
                              ? Object.keys(
                                  currentEntry[objectType].sourceList
                                ).map(key => {
                                  return (
                                    <li>
                                      <Tag>{key}</Tag>:{" "}
                                      <Tag intent={Intent.PRIMARY}>
                                        {
                                          currentEntry[objectType].sourceList[
                                            key
                                          ]
                                        }
                                      </Tag>
                                    </li>
                                  );
                                })
                              : null}
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td>Destination List</td>
                        <td>
                          <ul className="w4-list">
                            {currentEntry[objectType] &&
                            currentEntry[objectType].destinationList
                              ? Object.keys(
                                  currentEntry[objectType].destinationList
                                ).map(key => {
                                  return (
                                    <li>
                                      <Tag>{key}</Tag>:{" "}
                                      <Tag intent={Intent.PRIMARY}>
                                        {
                                          currentEntry[objectType]
                                            .destinationList[key]
                                        }
                                      </Tag>
                                    </li>
                                  );
                                })
                              : null}
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
            <Card className="pt-elevation-4">
              <div className="why">
                <div className="question-left">Why</div>
                <div className="detail-table-container" />
              </div>
            </Card>
          </div>
        ) : null}
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
