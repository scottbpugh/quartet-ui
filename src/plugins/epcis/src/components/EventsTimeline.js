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
import "./EventsTimeline.css";

export class EventsTimeline extends Component {
  render() {
    return (
      <div className="events-timeline-container">
        <svg
          viewBox="0 0 600 30"
          className="events-timeline"
          xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0,30)" className="parallelograms-container">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((event, index) => {
              let indentation = 58 * index;
              return (
                <g
                  className={`event-${event}`}
                  transform={`translate(${indentation}, 0)`}>
                  <path
                    d="M 167.82067,-20.09632 30.735128,-313.48168 559.61385,-314.38957 696.48062,-20.88511 Z"
                    className="event-parallelogram"
                    id="path1439"
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
}
