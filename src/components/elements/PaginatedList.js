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
import {Card, Tag, ControlGroup, Button, InputGroup,
  Intent} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router";
import {pluginRegistry} from "plugins/pluginRegistration";

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
      interactive: 'pt-interactive',
      loading: true,
      loadingRR: true,
      currentPage: null,
    };
    this.offset = 0;
    this.currentPage = 1;
    this.debounced = null;
    this.fetchEntries = null;
    this.timer = null;
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
    // this.setState({keywordSearch: evt.currentTarget.value}, () => {
      this.offset = 0;
      this.currentPage = 1;
      this.processEntries();
    // });
  };
  updateSearch = evt => {
    this.setState({keywordSearch: evt.currentTarget.value});
  };
  handleEnterKeySearch = evt => {
    if (evt.key === "Enter") {
      this.searchBy(evt);
    }
  };
  componentDidMount() {
    if (sessionStorage.getItem("loadingRR") === null ) {
      sessionStorage.setItem("loadingRR", false);
    }
    this.processEntries();
    this.setState({
      entries: this.props.entries,
      maxPages: 1,
      count: 0,
    });
    this.timer = setInterval(()=> {
      if(sessionStorage.getItem("loading") != this.state.loading) {
        this.setState({
          loading: JSON.parse(sessionStorage.getItem("loading")),
          loadingRR: JSON.parse(sessionStorage.getItem("loadingRR")),
        });
        if (this.state.loadingRR === null) {
          this.setState({
            loadingRR: false
          })
        }
      };
    }
    , 5);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  // refresh the Lists, keeping the search filters.
  componentWillReceiveProps(nextProps) {
    let maxPages = this.currentPage;
    if (nextProps.next !== null && Array.isArray(nextProps.entries)) {
      maxPages = Math.ceil(nextProps.count / nextProps.entries.length);
      console.log("nextProps.count", nextProps.count)
      console.log("nextProps.entries.length", nextProps.entries.length)
      console.log(Math.ceil(nextProps.count / nextProps.entries.length));
      if(Number.isNaN(maxPages)) {
        console.log("Change state: ", Number.isNaN(maxPages));
        
      }
      if(maxPages === Infinity) {
        this.setState({
          maxPages: 1
        });
      }
      else {
        this.setState({
          maxPages: maxPages
        });
      }
    }
    this.setState({
      currentPage: this.currentPage
    })
    this.setState({
      entries: nextProps.entries,
      count: nextProps.count,
      interactive: this.props.interactive === false ? '' : ' pt-interactive',
      loading: JSON.parse(sessionStorage.getItem("loading"))
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

  loadingScreen = () => {
    this.setState(
      { loading : true },
      () => {
          setTimeout(()=>{this.setState({loading : false})}, 6000);
      }
    );
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
    }, clear);
    // this.loadingScreen(); 
  };

  render() {
    console.log(this.state.maxPages)
    const {entries} = this.state;
    return (
      <Card className="pt-elevation-4">
        <h5>
          {" "}
          <div className="right-aligned-elem">
            <Button
              style={{marginRight: "5px"}}
              title="refresh"
              iconName="refresh"
              onClick={this.processEntries.bind(this, true)}
            />
            <Tag className="pt-large">
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
                  disabled={this.currentPage - 1 < 1 || this.state.loading === true || this.state.loadingRR === true}
                  onClick={this.previous.bind(this)}>
                  previous
                </Button>{" "}
                |{" "}
                <Button
                  disabled={this.currentPage >= this.state.maxPages  || this.state.loading === true || this.state.loadingRR === true}
                  onClick={this.next.bind(this)}>
                  next
                </Button>
              </div>
            </div>
            <div>
              <ControlGroup fill={false} vertical={false}>
              <Button intent={Intent.PRIMARY} onClick={this.searchBy}>Search</Button>
                {/* <div className="pt-select">
                  <select value={this.state.filter}>
                    <option value="">Search</option>
                  </select>
                </div> */}
                <InputGroup
                  onChange={this.updateSearch}
                  onKeyPress={this.handleEnterKeySearch}
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
            <table className={`pt-table pt-bordered pt-striped ${this.state.interactive}`}>
              <this.props.tableHeaderClass server={this.props.server} />
              <tbody
                style={{
                  textAlign: "center",
                  verticalAlign: "middle !important"
                }}>
                {Array.isArray(entries) && entries.length > 0 && this.state.loading === false && this.state.loadingRR === false && this.currentPage===this.state.currentPage
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
                    : 
                    this.state.loading === true 
                    || 
                    this.state.loadingRR === true ?
                  <tr className='tableLoading'>
                    <div class="middle">
                        <div class="bar bar1"></div>
                        <div class="bar bar2"></div>
                        <div class="bar bar3"></div>
                        <div class="bar bar4"></div>
                        <div class="bar bar5"></div>
                        <div class="bar bar6"></div>
                        <div class="bar bar7"></div>
                        <div class="bar bar8"></div>
                    </div>
                  </tr>  
                  : 
                  this.state.keywordSearch != "" && entries != undefined && entries.length === 0 && this.state.loading === false && this.state.loadingRR === false && this.currentPage===this.state.currentPage?
                  <tr className='tableLoading'>
                      <div class="middle searchResult">
                          <FormattedMessage
                              id="app.common.searchResult"
                              defaultMessage="No search result"
                          />
                      </div>
                  </tr>
                  : this.state.keywordSearch === "" && entries != undefined && entries.length === 0 && this.state.loading === false && this.state.loadingRR === false && this.currentPage===this.state.currentPage?
                  <tr className='tableLoading'>
                      <div class="middle searchResult">
                      <FormattedMessage
                              id="app.common.emptyArray"
                              defaultMessage="Empty array"
                          />
                      </div>
                  </tr>
                  :
                  <tr className='tableLoading'>
                    <div class="middle">
                        <div class="bar bar1"></div>
                        <div class="bar bar2"></div>
                        <div class="bar bar3"></div>
                        <div class="bar bar4"></div>
                        <div class="bar bar5"></div>
                        <div class="bar bar6"></div>
                        <div class="bar bar7"></div>
                        <div class="bar bar8"></div>
                    </div>
                  </tr> 
                  }
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    );
  }
}

export const PaginatedList = withRouter(_PaginatedList);

window.qu4rtet.exports("components/elements/PaginatedList", this);
