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

import {loadEPCISCriteria} from "../../reducers/output";
const React = qu4rtet.require("react");
const {Component} = React;
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");
const {PaginatedList} = qu4rtet.require("./components/elements/PaginatedList");
const {DeleteObject} = qu4rtet.require("./components/elements/DeleteObject");

const EPCISCriteriaTableHeader = props => (
  <thead style={{textAlign: "center", verticalAlign: "middle"}}>
    <tr>
      <th>
        {" "}
        <FormattedMessage id="plugins.output.id" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.output.name" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.output.endpoint" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.output.authenticationInfo" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.output.bizStep" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.output.bizLocation" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.output.sourceType" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.output.destinationType" />
      </th>
    </tr>
  </thead>
);

const EPCISCriteriaEntry = props => {
  const goTo = path => {
    props.history.push(path);
  };
  const goToPayload = goTo.bind(this, {
    pathname: `/output/${props.server.serverID}/add-criteria`,
    state: {defaultValues: props.entry, edit: true}
  });
  let deleteObj = DeleteObject ? (
    <DeleteObject
      entry={props.entry}
      operationId="output_epcis_output_criteria_delete"
      server={props.server}
      title={<FormattedMessage id="plugins.output.deleteCriteriaConfirm" />}
      body={<FormattedMessage id="plugins.output.deleteCriteriaConfirmBody" />}
      postDeleteAction={props.loadEntries}
    />
  ) : null;
  return (
    <tr key={props.entry.id}>
      <td onClick={goToPayload}>{props.entry.id}</td>
      <td onClick={goToPayload}>{props.entry.name}</td>
      <td onClick={goToPayload}>
        {props.entry.end_point ? props.entry.end_point.name : null}
      </td>
      <td onClick={goToPayload}>
        {props.entry.authentication_info
          ? props.entry.authentication_info.type
          : null}
      </td>
      <td onClick={goToPayload}>{props.entry.biz_step}</td>
      <td onClick={goToPayload}>{props.entry.biz_location}</td>
      <td onClick={goToPayload}>{props.entry.source_type}</td>
      <td onClick={goToPayload}>{props.entry.destination_type}</td>
      <td>{deleteObj}</td>
    </tr>
  );
};

class _EPCISCriteriaList extends Component {
  render() {
    const {server, criteria, loadEPCISCriteria, count, next} = this.props;
    return (
      <RightPanel
        title={
          <FormattedMessage id="plugins.output.EPCISOutputCriteriaList" />
        }>
        <div className="large-cards-container full-large">
          <PaginatedList
            {...this.props}
            listTitle={
              <FormattedMessage id="plugins.output.EPCISOutputCriteriaList" />
            }
            history={this.props.history}
            loadEntries={loadEPCISCriteria}
            server={server}
            entries={criteria}
            entryClass={EPCISCriteriaEntry}
            tableHeaderClass={EPCISCriteriaTableHeader}
            count={count}
            next={next}
          />
        </div>
      </RightPanel>
    );
  }
}

export const EPCISCriteriaList = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.output.servers &&
        state.output.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      criteria: isServerSet()
        ? state.output.servers[ownProps.match.params.serverID].criteria
        : [],
      count: isServerSet()
        ? state.output.servers[ownProps.match.params.serverID].count
        : 0,
      next: isServerSet()
        ? state.output.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadEPCISCriteria}
)(_EPCISCriteriaList);
