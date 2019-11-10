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
import {reduxForm} from "redux-form";
import {pluginRegistry} from "plugins/pluginRegistration";
import PageForm from "components/elements/PageForm";
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {Card} from "@blueprintjs/core";
import {loadLocationFields} from "../../reducers/masterdata";

const LocationFieldForm = reduxForm({
  form: "locationFieldForm"
})(PageForm);

class _AddLocationField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: []
    };
  }

  submitCallback() {
    // refresh list of trade items when field is saved...
    // this.props.loadTradeItems(this.props.server);
  }

  render() {
    let locationField = null;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      locationField = this.props.location.state.defaultValues;
    }
    const editMode = !!locationField && Object.keys(locationField).length > 1;
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.masterData.addLocationField" />
          ) : (
            <FormattedMessage id="plugins.masterData.editLocationField" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5 className="bp3-heading">
              {!editMode ? (
                <FormattedMessage id="plugins.masterData.addLocationField" />
              ) : (
                <FormattedMessage id="plugins.masterData.editLocationField" />
              )}
            </h5>
            <LocationFieldForm
              edit={false}
              operationId={
                editMode
                  ? "masterdata_location_fields_update"
                  : "masterdata_location_fields_create"
              }
              objectName="locationField"
              djangoPath="masterdata/location-fields/"
              prepopulatedValues={[]}
              existingValues={locationField}
              submitCallback={this.submitCallback.bind(this)}
              redirectPath={`/masterdata/locations/${
                this.props.server.serverID
              }`}
              parameters={locationField ? {id: locationField.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddLocationField = connect((state, ownProps) => {
  const isServerSet = () => {
    return (
      state.masterdata.servers &&
      state.masterdata.servers[ownProps.match.params.serverID]
    );
  };
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID],
    locationFields: isServerSet()
      ? state.masterdata.servers[ownProps.match.params.serverID].locationFields
      : []
  };
}, {})(_AddLocationField);
