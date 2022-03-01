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
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  getObjectType = currentEntry => {
    try {
      let key = Object.keys(currentEntry);
      return key[0];
    } catch (e) {
      return null;
    }
  };
  goToEventDetail = event => {
    var top = document.getElementById(event.id).offsetTop; //Getting Y of target element
    document.getElementById(event.id).scrollIntoView(
      {behavior: "smooth", 
      block: "start", 
      inline: "start"}
    );
    console.log("event", event);
      //Previous behaviour!!!
    // window.scrollTo(0, top);
  };
  render() {
    const {events} = this.props;

    return (
      <div className="events-timeline-container">
        <svg
          viewBox="0 0 600 30"
          className="events-timeline"
          xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0,30)" className="parallelograms-container">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((event, index) => {
              let eventClass = "unused-timeline-event";
              let eventStep = "";
              let currentEvent = null;
              if (typeof events[index] !== "undefined") {
                eventClass = "";
                try {
                  currentEvent = events[index][Object.keys(events[index])[0]];
                  eventStep = this.capitalize(
                    events[index][Object.keys(events[index])[0]].bizStep
                      .split(":")
                      .pop()
                  );
                } catch (e) {
                  // use event type instead.
                  eventStep = Object.keys(events[index])[0];
                }
              }
              const indentation = 58 * index;
              return (
                <g
                  className={`event-block event-${event} ${eventClass}`}
                  transform={`translate(${indentation}, 0)`}
                  onClick={
                    currentEvent
                      ? 
                      this.goToEventDetail.bind(this, currentEvent)
                      : null
                  }>
                  <path
                    d="M 167.82067,-20.09632 30.735128,-313.48168 559.61385,-314.38957 696.48062,-20.88511 Z"
                    className={`event-parallelogram event-${eventStep} `}
                    id="path1439"
                  />
                  <text className="event-para-label" x={36} y="-15">
                    <tspan text-anchor="middle">{eventStep}</tspan>
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
}
