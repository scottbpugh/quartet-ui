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
import {Tag} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";

export default class extends Component {
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
    const {goTo, currentEntry, objectType, serverID} = this.props;
    // fix for transactionEvent
    let epcList =
      currentEntry[objectType].epc_list || currentEntry[objectType].epcList;

    return (
      <div className="what">
        <div className="question-left">
          {" "}
          <FormattedMessage id="plugins.epcis.what" defaultMessage="What" />
        </div>
        <div className="detail-table-container">
          <table className="pt-table pt-bordered pt-striped">
            <tbody>
              <tr>
                <td>
                  <FormattedMessage
                    id="plugins.epcis.eventType"
                    defaultMessage="Event Type"
                  />
                </td>
                <td>
                  <span className="event-detail-type">
                    {this.getObjectTypeDisplay(objectType)}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <FormattedMessage
                    id="plugins.epcis.eventID"
                    defaultMessage="Event ID"
                  />
                </td>
                <td>
                  <Tag>{currentEntry[objectType].eventID}</Tag>
                </td>
              </tr>
              {currentEntry[objectType].parentID ? (
                <tr>
                  <td>
                    {" "}
                    <FormattedMessage
                      id="plugins.epcis.parentID"
                      defaultMessage="Parent ID"
                    />
                  </td>
                  <td>
                    <Tag
                      onClick={goTo.bind(
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
              {epcList ? (
                <tr>
                  <td>
                    <FormattedMessage
                      id="plugins.epcis.epcList"
                      defaultMessage="EPC List"
                    />
                  </td>
                  <td>
                    <div className="scrollable-list-container">
                      <ul className="w4-list float">
                        {epcList.map((epc, index) => {
                          return (
                            <li key={`${epc}-${index}`}>
                              <Tag
                                onClick={goTo.bind(
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
                  <td>
                    <FormattedMessage
                      id="plugins.epcis.inputEPCList"
                      defaultMessage="Input EPC List"
                    />
                  </td>
                  <td>
                    <div className="scrollable-list-container">
                      <ul className="w4-list float">
                        {currentEntry[objectType].inputEPCList.map(
                          (epc, index) => {
                            return (
                              <li
                                key={`${
                                  currentEntry[objectType].id
                                }-${epc}-${index}-iepclist`}>
                                <Tag
                                  onClick={goTo.bind(
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
                  <td>
                    {" "}
                    <FormattedMessage
                      id="plugins.epcis.outputEPCList"
                      defaultMessage="Output EPC List"
                    />
                  </td>
                  <td>
                    <div className="scrollable-list-container">
                      <ul className="w4-list float">
                        {currentEntry[objectType].outputEPCList.map(
                          (epc, index) => {
                            return (
                              <li
                                key={`${
                                  currentEntry[objectType].id
                                }-${epc}-${index}-oepclist`}>
                                <Tag
                                  onClick={goTo.bind(
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
                  <td>
                    {" "}
                    <FormattedMessage
                      id="plugins.epcis.ILMD"
                      defaultMessage="ILMD"
                    />
                  </td>
                  <td>
                    <ul className="w4-list">
                      {Object.keys(currentEntry[objectType].ilmd).map(
                        (key, index) => {
                          return (
                            <li
                              key={`${currentEntry[objectType]}-${index}-chQ`}>
                              {key}: {currentEntry[objectType].ilmd[key]}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </td>
                </tr>
              ) : null}
              {Array.isArray(currentEntry[objectType].childQuantityList) ? (
                <tr>
                  <td>
                    {" "}
                    <FormattedMessage
                      id="plugins.epcis.childQuantityList"
                      defaultMessage="Child Quantity List"
                    />
                  </td>
                  <td>
                    <ul className="w4-list">
                      {currentEntry[objectType].childQuantityList
                        ? currentEntry[objectType].childQuantityList.map(
                            (item, index) => {
                              return (
                                <li
                                  key={`${
                                    currentEntry[objectType].id
                                  }-chQ-${index}`}>
                                  <ul className="quantity-detail">
                                    {Object.keys(item).map(key => (
                                      <li key={`${key}-chQ`}>
                                        {key}: {item[key]}
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              );
                            }
                          )
                        : null}
                    </ul>
                  </td>
                </tr>
              ) : null}
              {currentEntry[objectType].inputQuantityList ? (
                <tr>
                  <td>
                    {" "}
                    <FormattedMessage
                      id="plugins.epcis.inputQuantityList"
                      defaultMessage="Input Quantity List"
                    />
                  </td>
                  <td>
                    <ul className="w4-list">
                      {currentEntry[objectType].inputQuantityList.map(
                        (item, index) => {
                          return (
                            <li
                              key={`${
                                currentEntry[objectType].id
                              }-${index}-iQL`}>
                              <ul className="quantity-detail">
                                {Object.keys(item).map(key => (
                                  <li key={key}>
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
                  <td>
                    {" "}
                    <FormattedMessage
                      id="plugins.epcis.outputQuantityList"
                      defaultMessage="Output Quantity List"
                    />
                  </td>
                  <td>
                    <ul className="w4-list">
                      {currentEntry[objectType].outputQuantityList.map(
                        (item, index) => {
                          return (
                            <li
                              key={`${
                                currentEntry[objectType].id
                              }-${index}-oQL`}>
                              <ul className="quantity-detail">
                                {Object.keys(item).map(key => (
                                  <li key={key}>
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
                  <td>
                    {" "}
                    <FormattedMessage
                      id="plugins.epcis.quantityList"
                      defaultMessage="Quantity List"
                    />
                  </td>
                  <td>
                    <ul className="w4-list">
                      {currentEntry[objectType].quantityList.map(
                        (item, index) => {
                          return (
                            <li
                              key={`${
                                currentEntry[objectType].id
                              }-${index}-qL`}>
                              <ul className="quantity-detail">
                                {Object.keys(item).map(key => (
                                  <li key={key}>
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
                  <td>
                    {" "}
                    <FormattedMessage
                      id="plugins.epcis.childEPCs"
                      defaultMessage="Child EPCs"
                    />
                  </td>
                  <td>
                    <div className="scrollable-list-container">
                      <ul className="w4-list float">
                        {currentEntry[objectType].childEPCs.map(
                          (item, index) => {
                            return (
                              <li
                                key={`${
                                  currentEntry[objectType].id
                                }-${index}-CEPC`}>
                                <Tag
                                  className="epc-item"
                                  onClick={goTo.bind(
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
                <td>
                  {" "}
                  <FormattedMessage
                    id="plugins.epcis.businessTransactionList"
                    defaultMessage="Business Transaction List"
                  />
                </td>
                <td>
                  <ul className="w4-list">
                    {currentEntry[objectType] &&
                    currentEntry[objectType].bizTransactionList
                      ? Object.keys(
                          currentEntry[objectType].bizTransactionList
                        ).map((key, index) => {
                          return (
                            <li
                              key={`${
                                currentEntry[objectType].id
                              }-${index}-bTL`}>
                              <Tag>{key}</Tag>:{" "}
                              <Tag className="epc-item">
                                {
                                  currentEntry[objectType].bizTransactionList[
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
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
