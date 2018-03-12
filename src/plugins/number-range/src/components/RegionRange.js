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
import {FormattedNumber} from "react-intl";

export default class RegionRange extends Component {
  render() {
    let start = Number(this.props.start);
    let end = Number(this.props.end);
    let state = Number(this.props.state);
    let range = end - start;
    let correctedStart = start;
    let remaining = Number(this.props.remaining);
    if (remaining) {
      // randomized
      correctedStart = end - remaining - start;
    } else if (state) {
      // serial
      correctedStart = state - start;
    }
    let percent = Math.ceil(correctedStart * 100 / (end - start) * 3);
    return (
      <div className="visual">
        <svg
          className="chart"
          width="320"
          height="40px"
          aria-labelledby="title desc"
          role="img">
          <g className="barchart">
            <g className="bar">
              <rect className="unused" width="300" height="40" />
            </g>
            <g className="bar">
              <rect className="used" width={percent} height="40" />
            </g>
            <text x="50%" y="25" textAnchor="middle">
              <FormattedNumber value={correctedStart}>
                {value => {
                  return value;
                }}
              </FormattedNumber>/
              <FormattedNumber value={range}>
                {value => {
                  return value;
                }}
              </FormattedNumber>
            </text>
          </g>
        </svg>
      </div>
    );
  }
}
