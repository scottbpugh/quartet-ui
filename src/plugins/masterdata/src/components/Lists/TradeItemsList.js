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
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {loadTradeItems} from "../../reducers/masterdata";
import {PaginatedList} from "components/elements/PaginatedList";

const TradeItemTableHeader = props => (
  <thead style={{textAlign: "center", verticalAlign: "middle"}}>
    <tr>
      <th>
        <FormattedMessage
          id="plugins.masterData.GTIN14"
          defaultMessage="GTIN 14"
        />
      </th>
      <th>
        <FormattedMessage id="plugins.masterData.NDC" defaultMessage="NDC" />
      </th>
      <th>
        <FormattedMessage
          id="plugins.masterData.countryOfOrigin"
          defaultMessage="Country of Origin"
        />
      </th>
      <th>
        <FormattedMessage
          id="plugins.masterData.functionalName"
          defaultMessage="Functional Name"
        />
      </th>
      <th>
        <FormattedMessage
          id="plugins.masterData.manufacturerName"
          defaultMessage="Manufacturer Name"
        />
      </th>
      <th>
        <FormattedMessage
          id="plugins.masterData.regulatedProductName"
          defaultMessage="Regulated Product Name"
        />
      </th>
    </tr>
  </thead>
);

const TradeItemEntry = props => {
  const goTo = path => {
    props.history.push(path);
  };

  let goToPayload = goTo.bind(this, {
    pathname: `/masterdata/edit-trade-item/${
      props.server.serverID
    }/trade-item/${props.entry.id}`,
    state: {defaultValues: props.entry, edit: true}
  });

  return (
    <tr key={props.entry.id}>
      <td onClick={goToPayload}>{props.entry.GTIN14}</td>
      <td onClick={goToPayload}>{props.entry.NDC}</td>
      <td onClick={goToPayload}>{props.entry.country_of_origin}</td>
      <td onClick={goToPayload}>{props.entry.functional_name}</td>
      <td onClick={goToPayload}>{props.entry.manufacturer_name}</td>
      <td onClick={goToPayload}>{props.entry.regulated_product_name}</td>
    </tr>
  );
};

class _TradeItemsList extends Component {
  render() {
    let {server, tradeItems, loadTradeItems, count, next} = this.props;
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.masterData.tradeItems"
            defaultMessage="Trade Items"
          />
        }>
        <div className="large-cards-container full-large">
          <PaginatedList
            history={this.props.history}
            loadEntries={loadTradeItems}
            server={server}
            entries={tradeItems}
            entryClass={TradeItemEntry}
            tableHeaderClass={TradeItemTableHeader}
            count={count}
            next={next}
          />

          {/* keep prop name generic for entries */}
        </div>
      </RightPanel>
    );
  }
}

export const TradeItemsList = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.masterdata.servers &&
        state.masterdata.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      tradeItems: isServerSet()
        ? state.masterdata.servers[ownProps.match.params.serverID].tradeItems
        : [],
      count: isServerSet()
        ? state.masterdata.servers[ownProps.match.params.serverID].count
        : 0,
      next: isServerSet()
        ? state.masterdata.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadTradeItems}
)(withRouter(_TradeItemsList));
