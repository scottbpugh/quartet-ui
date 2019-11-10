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
import {PermissionDialog} from "./Dialogs/GroupPermissionDialog";
import {loadPermissions} from "../../reducers/users";
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

const GroupForm = reduxForm({
  form: "GroupForm"
})(PageForm);

export class _AddGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: [],
      isGroupOpen: false,
      isPermissionOpen: false
    };
    this.state.group = null;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      this.state.group = this.props.location.state.defaultValues;
    }
  }

  togglePermissionDialog = evt => {
    this.setState({isPermissionOpen: !this.state.isPermissionOpen});
  };

  processM2Ms = (postValues, props) => {
    // replace m2m object of objects with array of ids only.
    Object.keys(postValues).forEach(field => {
      if (["permissions"].includes(field)) {
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
  };

  updateM2MValues = (formName, fieldName, objects) => {
    let group = this.state.group;
    if (group) {
      // we update the predefined group as to not replace
      // the picked items with the initial values each time.
      group[fieldName] = Object.keys(objects).map(key => {
        return objects[key];
      });
      this.setState({group: group});
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
            <FormattedMessage id="plugins.users.addGroup" />
          ) : (
            <FormattedMessage id="plugins.users.editGroup" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.users.addGroup" />
              ) : (
                <FormattedMessage id="plugins.users.editGroup" />
              )}
            </h5>
            <GroupForm
              edit={false}
              operationId={editMode ? "group_update" : "group_create"}
              objectName="group"
              djangoPath="group/"
              submitPrecall={this.processM2Ms}
              existingValues={this.state.group}
              redirectPath={`/users/${this.props.server.serverID}/groups/`}
              parameters={this.state.group ? {id: this.state.group.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
              fieldElements={{
                permissions: (
                  <PermissionDialog
                    {...this.props}
                    formName="GroupForm"
                    changeFieldValue={this.updateM2MValues}
                    isPermissionOpen={this.state.isPermissionOpen}
                    togglePermissionDialog={this.togglePermissionDialog}
                    existingValues={this.state.group}
                    permissions={this.props.permissions || []}
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

export const AddGroup = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.users.servers &&
        state.users.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
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
  {changeFieldValue, loadPermissions}
)(_AddGroup);
