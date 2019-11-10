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

import {loadGroups} from "../../reducers/users";
const React = qu4rtet.require("react");
const {Component} = React;
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");
const {PaginatedList} = qu4rtet.require("./components/elements/PaginatedList");
const {DeleteObject} = qu4rtet.require("./components/elements/DeleteObject");

const GroupTableHeader = props => (
  <thead style={{textAlign: "center", verticalAlign: "middle"}}>
    <tr>
      <th>
        {" "}
        <FormattedMessage id="plugins.users.id" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.users.name" />
      </th>
    </tr>
  </thead>
);

const GroupEntry = props => {
  const goTo = path => {
    props.history.push(path);
  };
  const goToPayload = goTo.bind(this, {
    pathname: `/users/${props.server.serverID}/add-group`,
    state: {defaultValues: props.entry, edit: true}
  });
  let deleteObj = DeleteObject ? (
    <DeleteObject
      entry={props.entry}
      operationId="group_delete"
      server={props.server}
      title={<FormattedMessage id="plugins.users.deleteGroupConfirm" />}
      body={<FormattedMessage id="plugins.users.deleteGroupConfirmBody" />}
      postDeleteAction={props.loadEntries}
    />
  ) : null;
  return (
    <tr key={props.entry.id}>
      <td onClick={goToPayload}>{props.entry.id}</td>
      <td onClick={goToPayload}>{props.entry.name}</td>
      <td>{deleteObj}</td>
    </tr>
  );
};

class _GroupsList extends Component {
  render() {
    const {server, groups, loadGroups, count, next} = this.props;
    return (
      <RightPanel title={<FormattedMessage id="plugins.users.groupsList" />}>
        <div className="large-cards-container full-large">
          <PaginatedList
            {...this.props}
            listTitle={<FormattedMessage id="plugins.users.groupsList" />}
            history={this.props.history}
            loadEntries={loadGroups}
            server={server}
            entries={groups}
            entryClass={GroupEntry}
            tableHeaderClass={GroupTableHeader}
            count={count}
            next={next}
          />
        </div>
      </RightPanel>
    );
  }
}

export const GroupsList = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.users.servers &&
        state.users.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      groups: isServerSet()
        ? state.users.servers[ownProps.match.params.serverID].groups
        : [],
      count: isServerSet()
        ? state.users.servers[ownProps.match.params.serverID].count
        : 0,
      next: isServerSet()
        ? state.users.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadGroups}
)(_GroupsList);
