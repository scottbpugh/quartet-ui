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
  Intent,
  ControlGroup,
  Button,
  InputGroup
} from "@blueprintjs/core";
import {FormattedMessage, FormattedDate, FormattedTime} from "react-intl";

class _ServerEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      keywordSearch: "",
      events: [],
      eventsPerPage: 20,
      inputSize: 50
    };
    this.offset = 0;
    this.currentPage = 0;
    this.debounced = null;
    this.maxPages = 0;
  }

  // filter by a field in the rows.
  filterBy = evt => {
    this.setState({filter: evt.currentTarget.value}, () => {
      this.offset = 0;
      this.currentPage = 0;
      this.processEvents(this.props.events);
    });
  };
  // search by a field in the rows or all of them.
  searchBy = evt => {
    this.setState({keywordSearch: evt.currentTarget.value}, () => {
      this.offset = 0;
      this.currentPage = 0;
      this.processEvents(this.props.events);
    });
  };
  componentDidMount() {
    this.processEvents(this.props.events || []);
  }

  // refresh the lists, keeping the search filters.
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.events) != JSON.stringify(this.props.events)) {
      this.processEvents(nextProps.events);
    }
  }

  // go to next page if possible.
  next = () => {
    if (this.currentPage + 1 < this.maxPages) {
      this.currentPage += 1;
      this.offset = this.state.eventsPerPage * this.currentPage;
      this.processEvents(this.props.events, true);
    }
  };

  // go to previous page if possible.
  previous = () => {
    if (this.currentPage - 1 >= 0) {
      this.currentPage -= 1;
      this.offset = this.state.eventsPerPage * this.currentPage;
      this.processEvents(this.props.events, true);
    }
  };
  processEvents = (events, clear = false) => {
    if (this.debounced) {
      clearTimeout(this.debounced);
    }
    this.debounced = setTimeout(() => {
      const searchExp = new RegExp(this.state.keywordSearch, "i");
      const eventsSubset = events.filter(event => {
        if (this.state.filter && this.state.keywordSearch) {
          return event[this.state.filter].match(searchExp);
        } else if (this.state.filter === "" && this.state.keywordSearch) {
          // search across all fields
          return JSON.stringify(event).match(searchExp);
        }
        return true;
      });
      this.maxPages = Math.ceil(eventsSubset.length / this.state.eventsPerPage);
      this.subsetTotal = eventsSubset.length;
      this.setState(
        {
          events: eventsSubset.slice(
            this.offset,
            this.offset + this.state.eventsPerPage
          )
        },
        () => {
          this.debounced = null;
        }
      );
    }, clear ? 0 : 250);
  };
  setEventsPerPage = evt => {
    this.currentPage = 0;
    this.offset = 0;
    let newEventsPerPage = Number(evt.currentTarget.value) | "";
    this.setState(
      {
        eventsPerPage: newEventsPerPage,
        inputSize: 10 * evt.currentTarget.value.length + 40
      },
      () => {
        this.processEvents(this.props.events);
      }
    );
  };
  render() {
    let serverName = this.props.server.serverSettingName;
    const {events} = this.state;
    return (
      <Card className="pt-elevation-4">
        <h5>
          {" "}
          <div className="right-aligned-elem">
            <Tag className="pt-large">
              {this.currentPage + 1}/{this.maxPages}
            </Tag>
          </div>
          {serverName} Events
        </h5>
        <div>
          <div className="table-control">
            <div className="pagination-control">
              <div>
                <Button
                  disabled={this.currentPage - 1 < 0}
                  onClick={this.previous.bind(this)}>
                  previous
                </Button>{" "}
                |{" "}
                <Button
                  disabled={this.currentPage + 1 >= this.maxPages}
                  onClick={this.next.bind(this)}>
                  next
                </Button>
              </div>
              <div>
                <input
                  className="pt-input"
                  placeholder="events"
                  name="eventPerPage"
                  dir="auto"
                  style={{width: this.state.inputSize, textAlign: "center"}}
                  value={this.state.eventsPerPage}
                  onChange={this.setEventsPerPage}
                />
                {"  "}
                events per page.
              </div>
            </div>
            <div>
              <ControlGroup fill={false} vertical={false}>
                <div className="pt-select">
                  <select value={this.state.filter} onChange={this.filterBy}>
                    <option value="">Search</option>
                    <option value="name">Task Name</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                <InputGroup
                  onChange={this.searchBy}
                  value={this.state.keywordSearch}
                  placeholder="Enter Keywords..."
                />
              </ControlGroup>
              <div className="label-info-display">
                <span>
                  Showing {this.subsetTotal}/{this.props.events
                    ? this.props.events.length
                    : 0}{" "}
                  events total.
                </span>
              </div>
            </div>
          </div>
          <div className="overflowed-table">
            <table className="pool-list-table pt-table pt-bordered pt-striped pt-interactive">
              <thead>
                <tr>
                  <th>
                    <FormattedMessage
                      id="plugins.epcis.eventTime"
                      defaultMessage="Event Time"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="plugins.epcis.recordTime"
                      defaultMessage="Record Time"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="plugins.epcis.eventUUID"
                      defaultMessage="Event UUID"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="plugins.epcis.bizStep"
                      defaultMessage="Business Step"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="plugins.epcis.disposition"
                      defaultMessage="Disposition"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="plugins.epcis.action"
                      defaultMessage="Action"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="plugins.epcis.readPoint"
                      defaultMessage="Read Point"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(events) && events.length > 0
                  ? events.map(event => {
                      return (
                        <tr key={event.id}>
                          <td>{event.event_time}</td>
                          <td>{event.record_time}</td>
                          <td>{event.id}</td>
                          <td>{event.biz_step}</td>
                          <td>{event.disposition}</td>
                          <td>{event.action}</td>
                          <td>{event.read_point}</td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    );
  }
}

export const ServerEvents = _ServerEvents;
