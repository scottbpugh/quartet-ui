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
import {Button, ControlGroup, InputGroup} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router";
import "./SingleCardPicker.css";
import {pluginRegistry} from "plugins/pluginRegistration";

/*
  Displays a list of objects (entries, events, companies, locations) as
  single cards.
*/
class _SingleCardPicker extends Component {
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
    this.setState({
      entries: this.props.entries,
      maxPages: 1
    });
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
      loadEntries(
        server,
        this.state.keywordSearch,
        this.currentPage,
        this.props.ordering ? this.props.ordering : null,
        this.props.type ? this.props.type : null
      );
    }, clear ? 0 : 250);
  };

  render() {
    const {entries} = this.state;
    return (
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
                placeholder={pluginRegistry
                  .getIntl()
                  .formatMessage({id: "app.common.enterKeywords"})}
              />
            </ControlGroup>
            <div className="label-info-display">
              <FormattedMessage
                id="app.common.entriesTotal"
                values={{entriesCount: this.props.count}}
              />
            </div>
          </div>
        </div>
        <div className="pick-cards-container">
          {Array.isArray(entries) && entries.length > 0
            ? entries.map((entry, index) => {
                return (
                  <div
                    className="card-picker"
                    key={`entry-card-${index}`}
                    style={this.props.entryStyle ? this.props.entryStyle : {}}>
                    <this.props.entryClass
                      {...this.props}
                      entry={entry}
                      server={this.props.server}
                      history={this.props.history}
                    />
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}

export const SingleCardPicker = withRouter(_SingleCardPicker);
window.qu4rtet.exports("components/elements/SingleCardPicker", this);
