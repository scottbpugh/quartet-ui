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
import {FormattedMessage, FormattedDate, FormattedTime} from "react-intl";

export default class extends Component {
  render() {
    const {currentEntry, objectType} = this.props;
    return (
      <div className="when">
        <div className="question-left">
          <FormattedMessage id="plugins.epcis.when" defaultMessage="When" />
        </div>
        <div className="detail-table-container" style={{width: "100%"}}>
          <table className="pt-table pt-bordered pt-striped">
            <tbody>
              <tr>
                <td>
Event Time
                </td>
                <td>
                  {currentEntry[objectType].eventTime}
                </td>
              </tr>
              <tr>
                <td>
eventTimezoneOffset
                </td>
                <td>
                  {currentEntry[objectType].eventTimezoneOffset}
                </td>
              </tr>
              <tr>
                <td>
Record Time
                </td>
                <td>
                  {currentEntry[objectType].recordTime}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
