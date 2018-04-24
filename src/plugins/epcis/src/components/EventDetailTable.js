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

export class EventDetailTable extends Component {
  getObjectType = currentEntry => {
    try {
      let key = Object.keys(currentEntry);
      return key[0];
    } catch (e) {
      return null;
    }
  };
  goTo = path => {
    this.props.history.push(path);
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
    const {currentEntry, serverID} = this.props;
    let objectType = this.getObjectType(currentEntry);
    debugger;
    return (
      <div>
        {currentEntry && currentEntry[objectType] ? (
          <div className={this.props.className}>
            <Card>
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
                            <Tag
                              onClick={this.goTo.bind(
                                this,
                                `/epcis/entry-detail/${serverID}/identifier/${
                                  currentEntry[objectType].parentID
                                }`
                              )}
                              className="epc-item">
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
                                      <Tag
                                        onClick={this.goTo.bind(
                                          this,
                                          `/epcis/entry-detail/${serverID}/identifier/${epc}`
                                        )}
                                        className="epc-item">
                                        {epc}
                                      </Tag>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                      {currentEntry[objectType].inputEPCList ? (
                        <tr>
                          <td>Input EPC List</td>
                          <td>
                            <div className="scrollable-list-container">
                              <ul className="w4-list float">
                                {currentEntry[objectType].inputEPCList.map(
                                  epc => {
                                    return (
                                      <li>
                                        <Tag
                                          onClick={this.goTo.bind(
                                            this,
                                            `/epcis/entry-detail/${serverID}/identifier/${epc}`
                                          )}
                                          className="epc-item">
                                          {epc}
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
                      {currentEntry[objectType].outputEPCList ? (
                        <tr>
                          <td>Output EPC List</td>
                          <td>
                            <div className="scrollable-list-container">
                              <ul className="w4-list float">
                                {currentEntry[objectType].outputEPCList.map(
                                  epc => {
                                    return (
                                      <li>
                                        <Tag
                                          onClick={this.goTo.bind(
                                            this,
                                            `/epcis/entry-detail/${serverID}/identifier/${epc}`
                                          )}
                                          className="epc-item">
                                          {epc}
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
                      {Array.isArray(
                        currentEntry[objectType].childQuantityList
                      ) ? (
                        <tr>
                          <td>Child Quantity List</td>
                          <td>
                            <ul className="w4-list">
                              {currentEntry[objectType].childQuantityList
                                ? currentEntry[
                                    objectType
                                  ].childQuantityList.map(item => {
                                    return (
                                      <li>
                                        <ul className="quantity-detail">
                                          {Object.keys(item).map(key => (
                                            <li>
                                              {key}: {item[key]}
                                            </li>
                                          ))}
                                        </ul>
                                      </li>
                                    );
                                  })
                                : null}
                            </ul>
                          </td>
                        </tr>
                      ) : null}
                      {currentEntry[objectType].inputQuantityList ? (
                        <tr>
                          <td>Input Quantity List</td>
                          <td>
                            <ul className="w4-list">
                              {currentEntry[objectType].inputQuantityList.map(
                                item => {
                                  return (
                                    <li>
                                      <ul className="quantity-detail">
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
                      {currentEntry[objectType].outputQuantityList ? (
                        <tr>
                          <td>Output Quantity List</td>
                          <td>
                            <ul className="w4-list">
                              {currentEntry[objectType].outputQuantityList.map(
                                item => {
                                  return (
                                    <li>
                                      <ul className="quantity-detail">
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
                                      <ul className="quantity-detail">
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
                                        <Tag
                                          className="epc-item"
                                          onClick={this.goTo.bind(
                                            this,
                                            `/epcis/entry-detail/${serverID}/identifier/${item}`
                                          )}>
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
                                      <Tag className="epc-item">
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
            <Card>
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
            <Card>
              <div className="where">
                <div className="question-left">Where</div>
                <div className="detail-table-container">
                  <table className="pt-table pt-bordered pt-striped">
                    <tbody>
                      <tr>
                        <td>Business Location</td>
                        <td>
                          <Tag className="epc-item">
                            {currentEntry[objectType].bizLocation}
                          </Tag>
                        </td>
                      </tr>
                      <tr>
                        <td>Read Point</td>
                        <td>
                          <Tag className="epc-item">
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
                                      <Tag className="epc-item">
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
                                      <Tag className="epc-item">
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
            <Card>
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
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    );
  }
}
