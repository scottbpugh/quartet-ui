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
import {Card} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {loadCompanies} from "../../reducers/masterdata";
import {SingleMarkerMap} from "components/elements/SingleMarkerMap";

class _ServerCompanies extends Component {
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
      const {loadCompanies, server} = this.props;
      loadCompanies(server, this.state.keywordSearch, this.currentPage);
    }, clear ? 0 : 250);
  };

  render() {
    const {entries} = this.state;
    return (
      <div className="auto-cards-container">
        {Array.isArray(entries) && entries.length > 0
          ? entries.map((entry, index) => {
              let goToPayload = this.goTo.bind(this, {
                pathname: `/masterdata/edit-company/${
                  this.props.server.serverID
                }/company/${entry.id}`,
                state: {defaultValues: entry, edit: true}
              });
              return (
                <div>
                  <Card className="region-detail pt-elevation-4 pt-interactive">
                    <h5 onClick={goToPayload}>{entry.name}</h5>
                    {entry.longitude && entry.latitude ? (
                      <SingleMarkerMap
                        targetId={entry.GLN13}
                        delay={Number(index) * 500}
                        size={{width: "100%", height: "150px"}}
                        markerLocation={[
                          Number(entry.longitude),
                          Number(entry.latitude)
                        ]}
                      />
                    ) : null}
                  </Card>
                </div>
              );
            })
          : null}
      </div>
    );
  }
}

const ServerCompanies = withRouter(_ServerCompanies);

class _CompaniesList extends Component {
  render() {
    let {server, companies, loadCompanies, count, next} = this.props;
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.masterData.companyList"
            defaultMessage="Companies"
          />
        }>
        <div className="large-cards-container full-large">
          <ServerCompanies
            history={this.props.history}
            loadCompanies={loadCompanies}
            server={server}
            entries={companies}
            count={count}
            next={next}
          />
          {/* keep prop name generic for entries */}
        </div>
      </RightPanel>
    );
  }
}

export const CompaniesList = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.masterdata.servers &&
        state.masterdata.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      companies: isServerSet()
        ? state.masterdata.servers[ownProps.match.params.serverID].companies
        : [],
      count: isServerSet()
        ? state.masterdata.servers[ownProps.match.params.serverID].count
        : 0,
      next: isServerSet()
        ? state.masterdata.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadCompanies}
)(withRouter(_CompaniesList));
