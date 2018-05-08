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
import {withRouter} from "react-router";

class _ServerEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      keywordSearch: "",
      events: [],
      eventsPerPage: 20,
      inputSize: 50,
      maxPages: 1
    };
    this.offset = 0;
    this.currentPage = 1;
    this.debounced = null;
    this.eventType = null;
    this.fetchEvents = null;
  }

  // filter by a field in the rows.
  filterBy = evt => {
    this.setState({filter: evt.currentTarget.value}, () => {
      this.offset = 0;
      this.currentPage = 1;
      this.processEvents();
    });
  };

  // search by a field in the rows or all of them.
  searchBy = evt => {
    this.setState({keywordSearch: evt.currentTarget.value}, () => {
      this.offset = 0;
      this.currentPage = 1;
      this.processEvents();
    });
  };

  componentDidMount() {
    if (this.props.match.params.eventType) {
      this.eventType = this.props.match.params.eventType;
    }
    this.processEvents();
    this.fetchEvents = setInterval(() => {
      this.processEvents();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchEvents);
    this.fetchEvents = null;
  }

  // refresh the lists, keeping the search filters.
  componentWillReceiveProps(nextProps) {
    let maxPages = this.currentPage;
    if (nextProps.next !== null && Array.isArray(nextProps.events)) {
      maxPages = Math.ceil(nextProps.count / nextProps.events.length);
    }
    this.setState({
      events: nextProps.events,
      maxPages: maxPages
    });
  }

  goTo = path => {
    this.props.history.push(path);
  };

  // go to next page if possible.
  next = () => {
    this.currentPage += 1;
    this.processEvents(true);
  };

  // go to previous page if possible.
  previous = () => {
    this.currentPage -= 1;
    this.offset = this.state.eventsPerPage * this.currentPage;
    this.processEvents(true);
  };

  processEvents = (clear = false) => {
    if (this.debounced) {
      clearTimeout(this.debounced);
    }
    this.debounced = setTimeout(() => {
      const {server} = this.props;
      this.props.loadEvents(
        server,
        this.eventType,
        this.state.keywordSearch,
        this.currentPage,
        "-record_time"
      );
    }, clear ? 0 : 250);
  };

  getEventType = type => {
    switch (type) {
      case "ag":
        return (
          <FormattedMessage
            id="plugins.epcis.aggregationEvent"
            defaultMessage="Aggregation Event"
          />
        );
      case "ob":
        return (
          <FormattedMessage
            id="plugins.epcis.objectEvent"
            defaultMessage="Object Event"
          />
        );
      case "tx":
        return (
          <FormattedMessage
            id="plugins.epcis.transactionEvent"
            defaultMessage="Transaction Event"
          />
        );
      case "tf":
        return (
          <FormattedMessage
            id="plugins.epcis.transformationEvent"
            defaultMessage="Transformation Event"
          />
        );
      default:
        return (
          <FormattedMessage id="plugins.epcis.event" defaultMessage="Event" />
        );
    }
  };
  render() {
    let serverName = this.props.server.serverSettingName;
    let serverID = this.props.server.serverID;
    const {events} = this.state;
    return (
      <Card className="pt-elevation-4">
        <h5>
          {" "}
          <div className="right-aligned-elem">
            <Tag className="pt-large">
              {this.currentPage}/{this.state.maxPages}
            </Tag>
          </div>
          {serverName} Events
        </h5>
        <div>
          <div className="table-control">
            <div className="pagination-control">
              <div>
                <Button
                  disabled={this.currentPage - 1 < 1}
                  onClick={this.previous.bind(this)}>
                  previous
                </Button>{" "}
                |{" "}
                <Button
                  disabled={this.currentPage >= this.state.maxPages}
                  onClick={this.next.bind(this)}>
                  next
                </Button>
              </div>
            </div>
            <div>
              <ControlGroup fill={false} vertical={false}>
                <div className="pt-select">
                  <select value={this.state.filter}>
                    <option value="">Search</option>
                  </select>
                </div>
                <InputGroup
                  onChange={this.searchBy}
                  value={this.state.keywordSearch}
                  placeholder="Enter Keywords..."
                />
              </ControlGroup>
              <div className="label-info-display">
                <FormattedMessage
                  id="plugins.epcis.eventsTotal"
                  values={{eventsCount: this.props.count}}
                />
              </div>
            </div>
          </div>
          <div className="overflowed-table">
            <table className="pool-list-table pt-table pt-bordered pt-striped pt-interactive">
              <thead>
                <tr>
                  <th>
                    <FormattedMessage
                      id="plugins.epcis.detail"
                      defaultMessage="Detail"
                    />
                  </th>
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
                      id="plugins.epcis.type"
                      defaultMessage="Event Type"
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
                        <tr
                          onClick={this.goTo.bind(
                            this,
                            `/epcis/event-detail/${serverID}/uuid/${event.id}`
                          )}
                          key={event.id}>
                          <td
                            style={{
                              align: "center",
                              textAlign: "center",
                              verticalAlign: "middle"
                            }}>
                            <Icon
                              intent={Intent.PRIMARY}
                              iconName="search-template"
                            />
                          </td>
                          <td>
                            <FormattedDate value={event.event_time} />{" "}
                            <FormattedTime value={event.event_time} />
                          </td>
                          <td>
                            {" "}
                            <FormattedDate value={event.record_time} />{" "}
                            <FormattedTime value={event.record_time} />
                          </td>
                          <td>{event.id}</td>
                          <td>{this.getEventType(event.type)}</td>
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

export const ServerEvents = withRouter(_ServerEvents);
