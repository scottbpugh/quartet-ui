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
import {pluginRegistry} from "plugins/pluginRegistration";
import Loader from "../Loader";

/*
  Displays a list of objects (entries, events, companies, locations) as
  single cards.
*/
class _PaginatedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      keywordSearch: "",
      entries: [],
      entriesPerPage: 20,
      inputSize: 50,
      maxPages: 1,
      count: 0,
      interactive: 'bp3-interactive'
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
      maxPages: 1,
      count: 0
    });
  }

  // refresh the Lists, keeping the search filters.
  componentWillReceiveProps(nextProps) {
    let maxPages = this.currentPage;
    if (nextProps.next !== null && Array.isArray(nextProps.entries)) {
      maxPages = Math.ceil(nextProps.count / nextProps.entries.length);
    }
    this.setState({
      entries: nextProps.entries,
      maxPages: maxPages,
      count: nextProps.count,
      interactive: this.props.interactive === false ? '' : ' bp3-interactive'
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
    if(!this.props.loading){
      return (
          <Card className="bp3-elevation-4">
            <h5>
              {" "}
              <div className="right-aligned-elem">
                <Button
                    style={{marginRight: "5px"}}
                    title="refresh"
                    iconName="refresh"
                    onClick={this.processEntries.bind(this, true)}
                />
                <Tag className="bp3-large">
                  {this.currentPage}/{this.state.maxPages}
                </Tag>
              </div>
              {this.props.listTitle ? this.props.listTitle : null}
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
                    <div className="bp3-select">
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
                        values={{entriesCount: this.state.count}}
                    />
                  </div>
                </div>
              </div>
              <div className="overflowed-table">
                <table className={`bp3-table bp3-bordered bp3-striped ${this.state.interactive}`}>
                  <this.props.tableHeaderClass server={this.props.server} />
                  <tbody
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle !important"
                      }}>
                  {Array.isArray(entries) && entries.length > 0
                      ? entries.map((entry, index) => {
                        return (
                            <this.props.entryClass
                                key={`entry-${index}`}
                                entry={entry}
                                loadEntries={this.props.loadEntries}
                                server={this.props.server}
                                history={this.props.history}
                                page={this.currentPage}
                            />
                        );
                      })
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
      );
    }else{
      return (
          <Loader/>
      )
    }

  }
}

export const PaginatedList = withRouter(_PaginatedList);

window.qu4rtet.exports("components/elements/PaginatedList", this);
