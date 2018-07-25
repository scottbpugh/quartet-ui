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
import {Button, ControlGroup, InputGroup, Tag} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router";
import {pluginRegistry} from "plugins/pluginRegistration";

/*
  Displays a list of objects (entries, events, companies, locations) as
  single cards and adds them to an array for M2Ms.
*/
class _MultiCardPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      keywordSearch: "",
      entries: [],
      entriesPerPage: 20,
      inputSize: 50,
      maxPages: 1,
      pickedItems: null
    };
    this.offset = 0;
    this.currentPage = 1;
    this.debounced = null;
    if (this.props.prepopulatedValues) {
      let newPicked = {};
      this.props.prepopulatedValues.forEach(entry => {
        newPicked[entry.id] = entry;
      });
      this.state.pickedItems = newPicked;
    }
  }

  componentDidMount() {
    this.setState({pickedItems: {}});
  }
  componentDidMount() {
    this.processEntries();
    this.setState({
      entries: this.props.entries,
      maxPages: 1
    });
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

  saveSelection = e => {
    this.props.changeValue(
      // convert to an array of objects for the rest of the app.
      Object.keys(this.state.pickedItems).map(key => {
        return this.state.pickedItems[key];
      })
    );
  };

  selectItems = entries => {
    let newPicked = {};
    entries.forEach(entry => {
      newPicked[entry.id] = entry;
    });
    this.setState({pickedItems: newPicked});
  };

  selectItem = entry => {
    let newPicked = {...this.state.pickedItems};
    if (newPicked[entry.id]) {
      delete newPicked[entry.id];
    } else {
      newPicked[entry.id] = entry;
    }
    this.setState({pickedItems: newPicked});
  };

  clearSelection = () => {
    this.setState({pickedItems: []});
  };

  removeSelected = selectedItem => {
    let newPicked = {...this.state.pickedItems};
    if (newPicked[selectedItem]) {
      delete newPicked[selectedItem];
      this.setState({pickedItems: newPicked});
    }
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
          <div
            style={{
              margin: "30px 0",
              width: "90%",
              minHeight: "160px",
              background: "rgba(0, 0, 0, 0.2)"
            }}>
            <div
              style={{
                display: "flex",

                justifyContent: "space-between"
              }}>
              <h6 style={{paddingTop: "15px", paddingLeft: "20px"}}>
                <FormattedMessage
                  id="app.common.selectedItems"
                  defaultValue="{count} Items Selected"
                  values={{
                    count: this.state.pickedItems
                      ? Object.keys(this.state.pickedItems).length
                      : 0
                  }}
                />
              </h6>
              <div>
                <button
                  style={{margin: "5px"}}
                  className="pt-button"
                  onClick={this.props.toggleDialog}>
                  <FormattedMessage id="app.common.cancelSubmit" />
                </button>
                <button
                  style={{margin: "5px"}}
                  className="pt-button pt-intent-warning"
                  onClick={this.clearSelection}>
                  <FormattedMessage id="app.common.clearSelection" />
                </button>
                <button
                  style={{margin: "5px"}}
                  className="pt-button pt-intent-primary"
                  onClick={this.saveSelection.bind(this)}>
                  <FormattedMessage id="app.common.saveSelection" />
                </button>
              </div>
            </div>
            <div
              style={{
                minHeight: "90px",
                margin: "10px"
              }}>
              {this.state.pickedItems
                ? Object.keys(this.state.pickedItems).map(item => {
                    return (
                      <Tag
                        style={{margin: "5px"}}
                        onRemove={this.removeSelected.bind(this, item)}>
                        {this.state.pickedItems[item].name}
                      </Tag>
                    );
                  })
                : null}
            </div>
          </div>
          {Array.isArray(entries) && entries.length > 0
            ? entries.map((entry, index) => {
                let selected = false;
                if (this.state.pickedItems[entry.id]) {
                  selected = true;
                }
                return (
                  <div
                    className="card-picker"
                    key={`entry-card-${index}`}
                    style={this.props.entryStyle ? this.props.entryStyle : {}}
                    onClick={this.selectItem.bind(this, entry)}>
                    <this.props.entryClass
                      {...this.props}
                      selected={selected}
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

export const MultiCardPicker = withRouter(_MultiCardPicker);
