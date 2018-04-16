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
  Callout,
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
                        <td>
                          <span className="event-detail-type">
                            {this.getObjectTypeDisplay(objectType)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Event ID</td>
                        <td>
                          <Tag>{currentEntry[objectType].eventID}</Tag>
                        </td>
                      </tr>
                      {currentEntry[objectType].parentID ? (
                        <tr>
                          <td>Parent ID</td>
                          <td>
                            <Tag intent={Intent.PRIMARY}>
                              {currentEntry[objectType].parentID}
                            </Tag>
                          </td>
                        </tr>
                      ) : null}
                      {currentEntry[objectType].epc_list ? (
                        <tr>
                          <td>EPC List</td>
                          <td>
                            <div className="scrollable-list-container">
                              <ul className="w4-list float">
                                {currentEntry[objectType].epc_list.map(epc => {
                                  return (
                                    <li>
                                      <Tag intent={Intent.PRIMARY}>{epc}</Tag>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                      {currentEntry[objectType].ilmd ? (
                        <tr>
                          <td>ILMD</td>
                          <td>
                            <ul className="w4-list">
                              {Object.keys(currentEntry[objectType].ilmd).map(
                                key => {
                                  return (
                                    <li>
                                      {key}:{" "}
                                      {currentEntry[objectType].ilmd[key]}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </td>
                        </tr>
                      ) : null}
                      {currentEntry[objectType].childQuantityList ? (
                        <tr>
                          <td>Child Quantity List</td>
                          <td>
                            <ul className="w4-list">
                              {currentEntry[objectType].childQuantityList.map(
                                item => {
                                  return (
                                    <li>
                                      <ul>
                                        {Object.keys(item).map(key => (
                                          <li>
                                            {key}: {item[key]}
                                          </li>
                                        ))}
                                      </ul>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </td>
                        </tr>
                      ) : null}
                      {currentEntry[objectType].quantityList ? (
                        <tr>
                          <td>Quantity List</td>
                          <td>
                            <ul className="w4-list">
                              {currentEntry[objectType].quantityList.map(
                                item => {
                                  return (
                                    <li>
                                      <ul>
                                        {Object.keys(item).map(key => (
                                          <li>
                                            {key}: {item[key]}
                                          </li>
                                        ))}
                                      </ul>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </td>
                        </tr>
                      ) : null}
                      {currentEntry[objectType].childEPCs ? (
                        <tr>
                          <td>Child EPCs</td>
                          <td>
                            <div className="scrollable-list-container">
                              <ul className="w4-list float">
                                {currentEntry[objectType].childEPCs.map(
                                  item => {
                                    return (
                                      <li>
                                        <Tag intent={Intent.PRIMARY}>
                                          {item}
                                        </Tag>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                      <tr>
                        <td>Business Transaction List</td>
                        <td>
                          <ul className="w4-list">
                            {currentEntry[objectType] &&
                            currentEntry[objectType].bizTransactionList
                              ? Object.keys(
                                  currentEntry[objectType].bizTransactionList
                                ).map(key => {
                                  return (
                                    <li>
                                      <Tag>{key}</Tag>:{" "}
                                      <Tag intent={Intent.PRIMARY}>
                                        {
                                          currentEntry[objectType]
                                            .bizTransactionList[key]
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
              <div className="when">
                <div className="question-left">When</div>
                <div className="detail-table-container" style={{width: "100%"}}>
                  <table className="pt-table pt-bordered pt-striped">
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
                <div className="detail-table-container">
                  <table className="pt-table pt-bordered pt-striped">
                    <tbody>
                      <tr>
                        <td>Business Step</td>
                        <td>
                          <Tag>{currentEntry[objectType].bizStep}</Tag>
                        </td>
                      </tr>

                      <tr>
                        <td>Disposition</td>
                        <td>
                          <Tag>{currentEntry[objectType].disposition}</Tag>
                        </td>
                      </tr>
                      <tr />
                      <tr>
                        <td>Action</td>
                        <td>
                          <Tag>{currentEntry[objectType].action}</Tag>
                        </td>
                      </tr>
                      <tr />
                      {currentEntry[objectType].errorDeclaration ? (
                        <tr>
                          <td>Error Declaration</td>
                          <td>
                            <pre>
                              {JSON.stringify(
                                currentEntry[objectType].errorDeclaration
                              )}
                            </pre>
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
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
