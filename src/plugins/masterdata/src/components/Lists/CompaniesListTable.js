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
import {SingleMarkerMap} from "components/elements/SingleMarkerMap";
import {PaginatedList} from "components/elements/PaginatedList";
import {loadCompanies} from "../../reducers/masterdata";
import {DeleteObject} from "components/elements/DeleteObject";

const CompanyEntry = props => {
  const goTo = path => {
    props.history.push(path);
  };

  const goToPayload = goTo.bind(this, {
    pathname: `/masterdata/edit-company/${props.server.serverID}/company/${
      props.entry.id
    }`,
    state: {defaultValues: props.entry, edit: true}
  });
  const goToPayloadIfNoGeo = () => {
    if (!props.entry.longitude) {
      goTo(`/masterdata/${props.server.serverID}/sgln/${props.entry.SGLN}`);
    }
  };
  return (
    <tr key={props.entry.id}>
      <td style={{width: "200px"}} onClick={goToPayloadIfNoGeo}>
        {props.entry.longitude && props.entry.latitude ? (
          <SingleMarkerMap
            targetId={props.entry.GLN13}
            delay={Number(props.index) * 500}
            markerLocation={[
              Number(props.entry.longitude),
              Number(props.entry.latitude)
            ]}
          />
        ) : null}
      </td>
      <td onClick={goToPayload}>{props.entry.GLN13}</td>
      <td onClick={goToPayload}>{props.entry.name}</td>
      <td onClick={goToPayload}>{props.entry.address1}</td>
      <td onClick={goToPayload}>{props.entry.country}</td>
      <td onClick={goToPayload}>{props.entry.city}</td>
      <td onClick={goToPayload}>{props.entry.company_type}</td>
      <td>
        <DeleteObject
          entry={props.entry}
          operationId="masterdata_companies_delete"
          server={props.server}
          title={
            <FormattedMessage id="plugins.masterData.deleteCompanyConfirm" />
          }
          body={
            <FormattedMessage id="plugins.masterData.deleteCompanyConfirmBody" />
          }
          postDeleteAction={props.loadEntries}
        />
      </td>
    </tr>
  );
};

const CompanyTableHeader = props => (
  <thead style={{textAlign: "center", verticalAlign: "middle"}}>
    <tr>
      <th>
        <FormattedMessage
          id="plugins.masterData.GeoLocation"
          defaultMessage="Geographic Preview"
        />
      </th>
      <th>
        <FormattedMessage
          id="plugins.masterData.gln13"
          defaultMessage="GLN13"
        />
      </th>
      <th>
        <FormattedMessage id="plugins.masterData.name" defaultMessage="Name" />
      </th>
      <th>
        <FormattedMessage
          id="plugins.masterData.address"
          defaultMessage="Address"
        />
      </th>
      <th>
        <FormattedMessage
          id="plugins.masterData.country"
          defaultMessage="Country"
        />
      </th>
      <th>
        <FormattedMessage id="plugins.masterData.city" defaultMessage="City" />
      </th>
      <th>
        <FormattedMessage
          id="plugins.masterData.companyType"
          defaultMessage="Company Type"
        />
      </th>
    </tr>
  </thead>
);

class _CompaniesList extends Component {
  render() {
    const {server, companies, loadCompanies, count, next} = this.props;
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.epcis.entryList"
            defaultMessage="Entries"
          />
        }>
        <div className="large-cards-container full-large">
          <PaginatedList
            history={this.props.history}
            listTitle={<FormattedMessage id="plugins.masterData.companies" />}
            loadEntries={loadCompanies}
            server={server}
            entries={companies}
            entryClass={CompanyEntry}
            tableHeaderClass={CompanyTableHeader}
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
