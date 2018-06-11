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

const LocationForm = reduxForm({
  form: "locationForm"
})(PageForm);

class _AddLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: []
    };
  }
  componentDidMount() {
    console.log("Mounting");
  }
  render() {
    let location = null;
    let editMode =
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.edit
        ? true
        : false;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      location = this.props.location.state.defaultValues;
    }
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.masterData.addLocation" />
          ) : (
            <FormattedMessage id="plugins.masterData.editLocation" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.masterData.addLocation" />
              ) : (
                <FormattedMessage id="plugins.masterData.editLocation" />
              )}
            </h5>
            <LocationForm
              edit={false}
              operationId={
                editMode
                  ? "masterdata_locations_update"
                  : "masterdata_locations_create"
              }
              objectName="location"
              djangoPath="masterdata/locations/"
              existingValues={location}
              redirectPath={`/masterdata/locations/${
                this.props.server.serverID
              }`}
              parameters={location ? {id: location.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddLocation = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID]
  };
})(_AddLocation);
