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
import {Card, Tag, ControlGroup, Button, InputGroup} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router";

class _ServerEntries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      keywordSearch: "",
      entries: [],
      entriesPerPage: 20,
      inputSize: 50,
      maxPages: 1
    };
    this.offset = 0;
    this.currentPage = 1;
    this.debounced = null;
    this.fetchEntries = null;
  }

  // filter by a field in the rows.
  filterBy = evt => {
    this.setState({filter: evt.currentTarget.value}, () => {
      this.offset = 0;
      this.currentPage = 1;
      this.processEntries();
    });
  };

  // search by a field in the rows or all of them.
  searchBy = evt => {
    this.setState({keywordSearch: evt.currentTarget.value}, () => {
      this.offset = 0;
      this.currentPage = 1;
      this.processEntries();
    });
  };

  componentDidMount() {
    this.processEntries();
    this.fetchEntries = setInterval(() => {
      this.processEntries();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchEntries);
    this.fetchEntries = null;
  }

  // refresh the lists, keeping the search filters.
  componentWillReceiveProps(nextProps) {
    let maxPages = this.currentPage;
    if (nextProps.next !== null && Array.isArray(nextProps.entries)) {
      maxPages = Math.ceil(nextProps.count / nextProps.entries.length);
    }
    this.setState({
      entries: nextProps.entries,
      maxPages: maxPages
    });
  }

  goTo = path => {
    this.props.history.push(path);
  };

  // go to next page if possible.
  next = () => {
    this.currentPage += 1;
    this.processEntries(true);
  };

  // go to previous page if possible.
  previous = () => {
    this.currentPage -= 1;
    this.processEntries(true);
  };

  processEntries = (clear = false) => {
    if (this.debounced) {
      clearTimeout(this.debounced);
    }
    this.debounced = setTimeout(() => {
      const {loadEntries, server} = this.props;
      loadEntries(server, this.state.keywordSearch, this.currentPage);
    }, clear ? 0 : 250);
  };

  render() {
    let serverName = this.props.server.serverSettingName;
    let serverID = this.props.server.serverID;
    const {entries} = this.state;
    return (
      <Card className="pt-elevation-4">
        <h5>
          {" "}
          <div className="right-aligned-elem">
            <Tag className="pt-large">
              {this.currentPage}/{this.state.maxPages}
            </Tag>
          </div>
          {serverName} Entries
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
                  id="plugins.epcis.entriesTotal"
                  values={{entriesCount: this.props.count}}
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
                      id="plugins.epcis.entryIdentifier"
                      defaultMessage="Entry Identifier"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="plugins.epcis.entryUUID"
                      defaultMessage="Entry UUID"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(entries) && entries.length > 0
                  ? entries.map(entry => {
                      return (
                        <tr
                          onClick={this.goTo.bind(
                            this,
                            `/epcis/entry-detail/${serverID}/identifier/${
                              entry.identifier
                            }`
                          )}
                          key={entry.id}>
                          <td>{entry.identifier}</td>
                          <td>{entry.id}</td>
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

export const ServerEntries = withRouter(_ServerEntries);
