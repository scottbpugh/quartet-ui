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
import {Card, Tag, Intent} from "@blueprintjs/core";
import {FormattedMessage, FormattedDate, FormattedTime} from "react-intl";

export default class extends Component {
  render() {
    const {goTo, currentEntry, objectType, serverID} = this.props;
    return (
      <div className="why">
        <div className="question-left">
          <FormattedMessage id="plugins.epcis.why" defaultMessage="Why" />
        </div>
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
                    {JSON.stringify(currentEntry[objectType].errorDeclaration)}
                  </pre>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
