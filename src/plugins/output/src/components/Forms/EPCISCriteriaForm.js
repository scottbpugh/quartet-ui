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
import {EndpointDialog} from "./Dialogs/EndpointDialog";
import {AuthenticationInfoDialog} from "./Dialogs/AuthenticationInfoDialog";
import {loadEndpoints, loadAuthenticationList} from "../../reducers/output";
const React = qu4rtet.require("react");
const {Component} = React;
const {Card} = qu4rtet.require("@blueprintjs/core");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const PageForm = qu4rtet.require("./components/elements/PageForm").default;
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {reduxForm} = qu4rtet.require("redux-form");
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");
const changeFieldValue = qu4rtet.require("redux-form").change;

const EPCISCriteriaForm = reduxForm({
  form: "EPCISCriteriaForm"
})(PageForm);

export class _AddEPCISCriteria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: [],
      isEndpointOpen: false,
      isAuthenticationInfoOpen: false
    };
  }
  componentDidMount() {
    this.props.loadEndpoints(this.props.server);
  }
  toggleEndpointDialog = evt => {
    this.setState({isEndpointOpen: !this.state.isEndpointOpen});
  };
  toggleAuthenticationInfoDialog = evt => {
    this.setState({
      isAuthenticationInfoOpen: !this.state.isAuthenticationInfoOpen
    });
  };
  render() {
    let criteria = null;
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
      criteria = this.props.location.state.defaultValues;
    }
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.output.addEPCISCriteria" />
          ) : (
            <FormattedMessage id="plugins.output.editEPCISCriteria" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5 className="bp3-heading">
              {!editMode ? (
                <FormattedMessage id="plugins.output.addEPCISCriteria" />
              ) : (
                <FormattedMessage id="plugins.output.editEPCISCriteria" />
              )}
            </h5>
            <EPCISCriteriaForm
              edit={false}
              operationId={
                editMode
                  ? "output_epcis_output_criteria_update"
                  : "output_epcis_output_criteria_create"
              }
              objectName="criteria"
              djangoPath="output/epcis-output-criteria/"
              existingValues={criteria}
              redirectPath={`/output/${
                this.props.server.serverID
              }/epcis-output-criteria/`}
              parameters={criteria ? {id: criteria.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
              submitPrecall={(postValues, props) => {
                if (typeof postValues.end_point === "object") {
                  try {
                    postValues.end_point = postValues.end_point.id || null;
                  } catch (e) {
                    // forget about it. Can throw an error if null, and we don't care.
                  }
                }
                if (typeof postValues.authentication_info === "object") {
                  try {
                    postValues.authentication_info =
                      postValues.authentication_info.id || null;
                  } catch (e) {
                    // forget about it. Can throw an error if null, and we don't care.
                  }
                }
              }}
              fieldElements={{
                end_point: (
                  <EndpointDialog
                    {...this.props}
                    formName={"EPCISCriteriaForm"}
                    changeFieldValue={this.props.changeFieldValue}
                    isEndpointOpen={this.state.isEndpointOpen}
                    toggleEndpointDialog={this.toggleEndpointDialog}
                    existingValues={criteria}
                    entries={this.props.endpoints || []}
                  />
                ),
                authentication_info: (
                  <AuthenticationInfoDialog
                    {...this.props}
                    formName={"EPCISCriteriaForm"}
                    changeFieldValue={this.props.changeFieldValue}
                    isAuthenticationInfoOpen={
                      this.state.isAuthenticationInfoOpen
                    }
                    toggleAuthenticationInfoDialog={
                      this.toggleAuthenticationInfoDialog
                    }
                    existingValues={criteria}
                    entries={this.props.authenticationList || []}
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

export const AddEPCISCriteria = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.output.servers &&
        state.output.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      theme: state.layout.theme,
      endpoints: isServerSet()
        ? state.output.servers[ownProps.match.params.serverID].endpoints
        : [],
      authenticationList: isServerSet()
        ? state.output.servers[ownProps.match.params.serverID]
            .authenticationList
        : [],
      count: isServerSet()
        ? state.output.servers[ownProps.match.params.serverID].count
        : 0,
      next: isServerSet()
        ? state.output.servers[ownProps.match.params.serverID].next
        : null
    };
  },
  {loadEndpoints, changeFieldValue, loadAuthenticationList}
)(_AddEPCISCriteria);
