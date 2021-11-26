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
import {loadCompanyTypes} from "../../reducers/masterdata";

const CompanyTypeForm = reduxForm({
  form: "companyTypeForm"
})(PageForm);

class _AddCompanyType extends Component {
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
    let companyType = this.props.companyTypes
      ? this.props.companyTypes.find(companyType => {
          return (
            Number(companyType.id) ===
            Number(this.props.match.params.companyTypeID)
          );
        })
      : null;
    if (
      this.props.company &&
      this.props.company.state &&
      this.props.company.state.defaultValues
    ) {
      // to prepopulate with existing values.
      companyType = this.props.company.state.defaultValues;
    }
    const editMode = !!companyType;
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.masterData.addCompanyType" />
          ) : (
            <FormattedMessage id="plugins.masterData.editCompanyType" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5 className="bp3-heading">
              {!editMode ? (
                <FormattedMessage id="plugins.masterData.addCompanyType" />
              ) : (
                <FormattedMessage id="plugins.masterData.editCompanyType" />
              )}
            </h5>
            <CompanyTypeForm
              edit={false}
              operationId={
                editMode
                  ? "masterdata_company_types_update"
                  : "masterdata_company_types_create"
              }
              objectName="companyType"
              djangoPath="masterdata/company-types/"
              prepopulatedValues={[]}
              existingValues={companyType}
              submitCallback={this.submitCallback.bind(this)}
              redirectPath={`/masterdata/companies/${
                this.props.server.serverID
              }`}
              parameters={companyType ? {id: companyType.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddCompanyType = connect(
  (state, ownProps) => {
    const isServerSet = () => {
      return (
        state.masterdata.servers &&
        state.masterdata.servers[ownProps.match.params.serverID]
      );
    };
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      companyTypes: isServerSet()
        ? state.masterdata.servers[ownProps.match.params.serverID].companyTypes
        : []
    };
  },
  {loadCompanyTypes}
)(_AddCompanyType);
