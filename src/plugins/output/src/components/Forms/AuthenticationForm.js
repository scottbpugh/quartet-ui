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
const React = qu4rtet.require("react");
const {Component} = React;
const {Card} = qu4rtet.require("@blueprintjs/core");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const PageForm = qu4rtet.require("./components/elements/PageForm").default;
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {reduxForm} = qu4rtet.require("redux-form");
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");

const AuthenticationForm = reduxForm({
  form: "AuthenticationForm"
})(PageForm);

export class _AddAuthentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: []
    };
  }

  render() {
    let authentication = null;
    const editMode = !!(
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.edit
    );
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      authentication = this.props.location.state.defaultValues;
    }
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.output.addAuthentication" />
          ) : (
            <FormattedMessage id="plugins.output.editAuthentication" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5 className="bp3-heading">
              {!editMode ? (
                <FormattedMessage id="plugins.output.addAuthentication" />
              ) : (
                <FormattedMessage id="plugins.output.editAuthentication" />
              )}
            </h5>
            <AuthenticationForm
              edit={false}
              operationId={
                editMode
                  ? "output_authentication_info_update"
                  : "output_authentication_info_create"
              }
              objectName="authentication"
              djangoPath="output/authentication-info/"
              existingValues={authentication}
              redirectPath={`/output/${
                this.props.server.serverID
              }/authentication/`}
              parameters={authentication ? {id: authentication.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddAuthentication = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID]
  };
}, {})(_AddAuthentication);
