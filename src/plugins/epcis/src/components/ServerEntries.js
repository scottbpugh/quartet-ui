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
import "./EntryList.css";

class _ServerEntries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      keywordSearch: "",
      entries: [],
      entriesPerPage: 20,
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
      this.processEntries(this.props.entries);
    });
  };
  // search by a field in the rows or all of them.
  searchBy = evt => {
    this.setState({keywordSearch: evt.currentTarget.value}, () => {
      this.offset = 0;
      this.currentPage = 0;
      this.processEntries(this.props.entries);
    });
  };
  componentDidMount() {
    this.processEntries(this.props.entries || []);
  }

  // refresh the lists, keeping the search filters.
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.entries) !== JSON.stringify(this.props.entries)
    ) {
      this.processEntries(nextProps.entries);
    }
  }

  goTo = path => {
    this.props.history.push(path);
  };

  // go to next page if possible.
  next = () => {
    if (this.currentPage + 1 < this.maxPages) {
      this.currentPage += 1;
      this.offset = this.state.entriesPerPage * this.currentPage;
      this.processEntries(this.props.entries, true);
    }
  };

  // go to previous page if possible.
  previous = () => {
    if (this.currentPage - 1 >= 0) {
      this.currentPage -= 1;
      this.offset = this.state.entriesPerPage * this.currentPage;
      this.processEntries(this.props.entries, true);
    }
  };
  processEntries = (entries, clear = false) => {
    if (this.debounced) {
      clearTimeout(this.debounced);
    }
    this.debounced = setTimeout(() => {
      const searchExp = new RegExp(this.state.keywordSearch, "i");
      const entriesSubset = entries.filter(entry => {
        if (this.state.filter && this.state.keywordSearch) {
          return entry[this.state.filter].match(searchExp);
        } else if (this.state.filter === "" && this.state.keywordSearch) {
          // search across all fields
          return JSON.stringify(entry).match(searchExp);
        }
        return true;
      });
      this.maxPages = Math.ceil(
        entriesSubset.length / this.state.entriesPerPage
      );
      this.subsetTotal = entriesSubset.length;
      this.setState(
        {
          entries: entriesSubset.slice(
            this.offset,
            this.offset + this.state.entriesPerPage
          )
        },
        () => {
          this.debounced = null;
        }
      );
    }, clear ? 0 : 250);
  };
  setEntriesPerPage = evt => {
    this.currentPage = 0;
    this.offset = 0;
    let newEntriesPerPage = Number(evt.currentTarget.value) | "";
    this.setState(
      {
        entriesPerPage: newEntriesPerPage,
        inputSize: 10 * evt.currentTarget.value.length + 40
      },
      () => {
        this.processEntries(this.props.entries);
      }
    );
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
              {this.currentPage + 1}/{this.maxPages}
            </Tag>
          </div>
          {serverName} Entries
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
                  placeholder="entries"
                  name="entryPerPage"
                  dir="auto"
                  style={{width: this.state.inputSize, textAlign: "center"}}
                  value={this.state.entriesPerPage}
                  onChange={this.setEntriesPerPage}
                />
                {"  "}
                entries per page.
              </div>
            </div>
            <div>
              <ControlGroup fill={false} vertical={false}>
                <div className="pt-select">
                  <select value={this.state.filter} onChange={this.filterBy}>
                    <option value="">Search</option>
                    <option value="identifier">Identifier</option>
                    <option value="id">UUID</option>
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
                  Showing {this.subsetTotal}/{this.props.entries
                    ? this.props.entries.length
                    : 0}{" "}
                  entries total.
                </span>
              </div>
            </div>
          </div>
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
                          `/epcis/entry-detail/${serverID}/uuid/${
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
      </Card>
    );
  }
}

export const ServerEntries = _ServerEntries;
