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

import {loadUsers} from "../../reducers/users";
const React = qu4rtet.require("react");
const {Component} = React;
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");
const {PaginatedList} = qu4rtet.require("./components/elements/PaginatedList");
const {DeleteObject} = qu4rtet.require("./components/elements/DeleteObject");
const {Tag, Intent} = qu4rtet.require("@blueprintjs/core");

const UsersTableHeader = props => (
  <thead style={{textAlign: "center", verticalAlign: "middle"}}>
    <tr>
      <th>
        {" "}
        <FormattedMessage id="plugins.users.username" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.users.first_name" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.users.last_name" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.users.email" />
      </th>
      <th>
        {" "}
        <FormattedMessage id="plugins.users.userStatus" />
      </th>
    </tr>
  </thead>
);

const UsersEntry = props => {
  const goTo = path => {
    props.history.push(path);
  };
  const goToPayload = goTo.bind(this, {
    pathname: `/users/${props.server.serverID}/add-user`,
    state: {defaultValues: props.entry, edit: true}
  });
  let deleteObj = DeleteObject ? (
    <DeleteObject
      entry={props.entry}
      operationId="user_delete"
      server={props.server}
      title={<FormattedMessage id="plugins.users.deleteUserConfirm" />}
      body={<FormattedMessage id="plugins.users.deleteUserConfirmBody" />}
      postDeleteAction={props.loadEntries}
    />
  ) : null;
  return (
    <tr key={props.entry.id}>
      <td onClick={goToPayload}>{props.entry.username}</td>
      <td onClick={goToPayload}>{props.entry.first_name}</td>
      <td onClick={goToPayload}>{props.entry.last_name}</td>
      <td onClick={goToPayload}>{props.entry.email}</td>
      <td onClick={goToPayload} style={{textAlign: "center"}}>
        {props.entry.is_staff ? (
          <Tag intent={Intent.SUCCESS} style={{marginBottom: "10px"}}>
            <FormattedMessage id="plugins.users.is_staff" />
          </Tag>
        ) : null}
        <br />
        {props.entry.is_active ? (
          <Tag intent={Intent.SUCCESS} style={{marginBottom: "10px"}}>
            <FormattedMessage id="plugins.users.is_active" />
          </Tag>
        ) : null}
        <br />
        {props.entry.is_superuser ? (
          <Tag intent={Intent.SUCCESS} style={{marginBottom: "10px"}}>
            <FormattedMessage id="plugins.users.is_superuser" />
          </Tag>
        ) : null}
      </td>
      <td>{deleteObj}</td>
    </tr>
  );
};

class _UsersList extends Component {
  render() {
    const {server, users, loadUsers, count, next} = this.props;
    return (
      <RightPanel title={<FormattedMessage id="plugins.users.usersList" />}>
        <div className="large-cards-container full-large">
          <PaginatedList
            {...this.props}
            listTitle={<FormattedMessage id="plugins.users.usersList" />}
            history={this.props.history}
            loadEntries={loadUsers}
            server={server}
            entries={users}
            entryClass={UsersEntry}
            tableHeaderClass={UsersTableHeader}
            count={count}
            next={next}
          />

          {/* keep prop name generic for entries */}
        </div>
      </RightPanel>
    );
  }
}

export const UsersList = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.users.servers &&
        state.users.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      users: isServerSet()
        ? state.users.servers[ownProps.match.params.serverID].users
        : [],
      count: isServerSet()
        ? state.users.servers[ownProps.match.params.serverID].count
        : 0,
      next: isServerSet()
        ? state.users.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadUsers}
)(_UsersList);
