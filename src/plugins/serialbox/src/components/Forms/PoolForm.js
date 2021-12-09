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
import {reduxForm, change as changeFieldValue} from "redux-form";
import {pluginRegistry} from "plugins/pluginRegistration";
import PageForm from "components/elements/PageForm";
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {Card} from "@blueprintjs/core";
import {
    loadPool
} from "../../reducers/numberrange";

const PoolForm = reduxForm({
    form: "poolForm"
})(PageForm);

class _AddPool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formStructure: [],
        };
    }
    render() {
        let location = null;
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
                        <h5 className="bp3-heading">
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
                            fieldElements={{
                                company: (
                                    <CompanyDialog
                                        {...this.props}
                                        formName={"locationForm"}
                                        changeFieldValue={this.props.changeFieldValue}
                                        isCompanyOpen={this.state.isCompanyOpen}
                                        toggleCompanyDialog={this.toggleCompanyDialog}
                                        existingValues={location}
                                        companies={this.props.companies || []}
                                    />
                                ),
                                site: (
                                    <SiteDialog
                                        {...this.props}
                                        formName={"locationForm"}
                                        changeFieldValue={this.props.changeFieldValue}
                                        isSiteOpen={this.state.isSiteOpen}
                                        toggleSiteDialog={this.toggleSiteDialog}
                                        existingValues={location}
                                        locations={this.props.locations || []}
                                    />
                                ),
                                location_type: (
                                    <LocationTypeDialog
                                        {...this.props}
                                        formName={"locationForm"}
                                        changeFieldValue={this.props.changeFieldValue}
                                        isLocationTypeOpen={this.state.isLocationTypeOpen}
                                        toggleLocationTypeDialog={this.toggleLocationTypeDialog}
                                        existingValues={location}
                                        locationTypes={this.props.locationTypes || []}
                                    />
                                )
                            }}
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

export const AddLocation = connect(
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
            locations: isServerSet()
                ? state.masterdata.servers[ownProps.match.params.serverID].locations
                : [],
            locationTypes: isServerSet()
                ? state.masterdata.servers[ownProps.match.params.serverID].locationTypes
                : [],
            count: isServerSet()
                ? state.masterdata.servers[ownProps.match.params.serverID].count
                : 0,
            next: isServerSet()
                ? state.masterdata.servers[ownProps.match.params.serverID].next
                : null,
            theme: state.layout.theme
        };
    },
    {loadCompanies, loadLocations, loadLocationTypes, changeFieldValue}
)(_AddLocation);
