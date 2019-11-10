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
import {withRouter} from "react-router";

class _Where extends Component {
  goTo = path => {
    this.props.history.push(path);
  };
  render() {
    const {currentEntry, objectType} = this.props;
    return (
      <div className="where">
        <div className="question-left">
          <FormattedMessage id="plugins.epcis.where" defaultMessage="Where" />
        </div>
        <div className="detail-table-container">
          <table className="paginated-list-table bp3-html-table bp3=small bp3-html-table-bordered bp3-html-table-striped">
            <tbody>
              <tr>
                <td>Business Location</td>
                <td>
                  <Tag
                    className="epc-item"
                    onClick={this.goTo.bind(
                      this,
                      `/masterdata/${this.props.serverID}/sgln/${
                        currentEntry[objectType].bizLocation
                      }`
                    )}>
                    {currentEntry[objectType].bizLocation}
                  </Tag>
                </td>
              </tr>
              <tr>
                <td>Read Point</td>
                <td>
                  <Tag
                    className="epc-item"
                    onClick={this.goTo.bind(
                      this,
                      `/masterdata/${this.props.serverID}/sgln/${
                        currentEntry[objectType].readPoint
                      }`
                    )}>
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
                      ? Object.keys(currentEntry[objectType].sourceList).map(
                          key => {
                            return (
                              <li key={key}>
                                <Tag>{key}</Tag>:{" "}
                                <Tag
                                  className="epc-item"
                                  onClick={this.goTo.bind(
                                    this,
                                    `/masterdata/${this.props.serverID}/sgln/${
                                      currentEntry[objectType].sourceList[key]
                                    }`
                                  )}>
                                  {currentEntry[objectType].sourceList[key]}
                                </Tag>
                              </li>
                            );
                          }
                        )
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
                        ).map((key, index) => {
                          return (
                            <li
                              key={`${
                                currentEntry[objectType].id
                              }-${index}-dL`}>
                              <Tag>{key}</Tag>:{" "}
                              <Tag
                                className="epc-item"
                                onClick={this.goTo.bind(
                                  this,
                                  `/masterdata/${this.props.serverID}/sgln/${
                                    currentEntry[objectType].destinationList[
                                      key
                                    ]
                                  }`
                                )}>
                                {currentEntry[objectType].destinationList[key]}
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

export default withRouter(_Where);
