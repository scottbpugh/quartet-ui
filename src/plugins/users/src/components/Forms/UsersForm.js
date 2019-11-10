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
import {GroupDialog} from "./Dialogs/GroupDialog";
import {PermissionDialog} from "./Dialogs/PermissionDialog";
import {loadGroups, loadPermissions} from "../../reducers/users";
const React = qu4rtet.require("react");
const {Component} = React;
const {Card} = qu4rtet.require("@blueprintjs/core");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const PageForm = qu4rtet.require("./components/elements/PageForm").default;
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {reduxForm} = qu4rtet.require("redux-form");
const changeFieldValue = qu4rtet.require("redux-form").change;
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");

const UserForm = reduxForm({
  form: "UserForm"
})(PageForm);

export class _AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: [],
      isGroupOpen: false,
      isPermissionOpen: false
    };
    this.state.user = null;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      this.state.user = this.props.location.state.defaultValues;
    }
  }
  toggleGroupDialog = evt => {
    this.setState({isGroupOpen: !this.state.isGroupOpen});
  };

  togglePermissionDialog = evt => {
    this.setState({isPermissionOpen: !this.state.isPermissionOpen});
  };

  processFields = (postValues, props) => {
    // Django wants the first and last name defined, even if
    // it's an empty string. Won't accept not having them
    // in the post.
    if (!("first_name" in postValues)) {
      postValues["first_name"] = "";
    }
    if (!("last_name" in postValues)) {
      postValues["last_name"] = "";
    }

    if (postValues["first_name"] === null) {
      // Django expects an empty string, not null,
      // unlike every other model in the world.
      postValues["first_name"] = "";
    }
    if (postValues["last_name"] === null) {
      postValues["last_name"] = "";
    }
    // replace m2m object of objects with array of ids only.
    Object.keys(postValues).forEach(field => {
      if (["user_permissions", "groups"].includes(field)) {
        if (postValues[field] instanceof Array) {
          // convert array of [item1, item2] into [id1, id2]
          postValues[field] = postValues[field].map(item => {
            if (item instanceof Object) {
              return item.id;
            }
            return item;
          });
        }
      }
    });
    if (!("groups" in postValues)) {
      postValues["groups"] = [];
    }
    if (!("user_permissions" in postValues)) {
      postValues["user_permissions"] = [];
    }
  };

  updateM2MValues = (formName, fieldName, objects) => {
    let user = this.state.user;
    if (user) {
      // we update the predefined user as to not replace
      // the picked items with the initial values each time.
      user[fieldName] = Object.keys(objects).map(key => {
        return objects[key];
      });
      this.setState({user: user});
    }
    this.props.changeFieldValue(formName, fieldName, objects);
  };

  render() {
    const editMode = !!(
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.edit
    );
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.users.addUser" />
          ) : (
            <FormattedMessage id="plugins.users.editUser" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5 className="bp3-heading">
              {!editMode ? (
                <FormattedMessage id="plugins.users.addUser" />
              ) : (
                <FormattedMessage id="plugins.users.editUser" />
              )}
            </h5>
            <UserForm
              edit={false}
              operationId={editMode ? "user_update" : "user_create"}
              objectName="user"
              djangoPath="user/"
              submitPrecall={this.processFields}
              existingValues={this.state.user}
              redirectPath={`/users/${this.props.server.serverID}/users/`}
              parameters={this.state.user ? {id: this.state.user.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
              fieldElements={{
                groups: (
                  <GroupDialog
                    {...this.props}
                    formName="UserForm"
                    changeFieldValue={this.updateM2MValues}
                    isGroupOpen={this.state.isGroupOpen}
                    toggleGroupDialog={this.toggleGroupDialog}
                    existingValues={this.state.user}
                    groups={this.props.groups || {}}
                  />
                ),
                user_permissions: (
                  <PermissionDialog
                    {...this.props}
                    formName="UserForm"
                    changeFieldValue={this.updateM2MValues}
                    isPermissionOpen={this.state.isPermissionOpen}
                    togglePermissionDialog={this.togglePermissionDialog}
                    existingValues={this.state.user}
                    permissions={this.props.permissions || {}}
                  />
                )
              }}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddUser = connect(
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
        : null,
      theme: state.layout.theme,
      permissions: isServerSet()
        ? state.users.servers[ownProps.match.params.serverID].permissions
        : []
    };
  },
  {loadGroups, changeFieldValue, loadPermissions}
)(_AddUser);
