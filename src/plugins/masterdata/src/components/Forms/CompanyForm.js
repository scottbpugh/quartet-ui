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

const CompanyForm = reduxForm({
  form: "CompanyForm"
})(PageForm);

class _AddCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: []
    };
  }

  render() {
    let company = null;
    const editMode = !!(this.props.location
      && this.props.location.state
      && this.props.location.state.edit);
    if (
      this.props.location
      && this.props.location.state
      && this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      company = this.props.location.state.defaultValues;
    }
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.masterData.addCompany" />
          ) : (
            <FormattedMessage id="plugins.masterData.editCompany" />
          )
        }
      >
        <div className="large-cards-container">
          <Card className="form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.masterData.addCompany" />
              ) : (
                <FormattedMessage id="plugins.masterData.editCompany" />
              )}
            </h5>
            <CompanyForm
              edit={false}
              operationId={
                editMode
                  ? "masterdata_companies_update"
                  : "masterdata_companies_create"
              }
              objectName="company"
              djangoPath="masterdata/companies/"
              existingValues={company}
              redirectPath={`/masterdata/companies/${
                this.props.server.serverID
              }`}
              parameters={company ? {id: company.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddCompany = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID]
  };
})(_AddCompany);
