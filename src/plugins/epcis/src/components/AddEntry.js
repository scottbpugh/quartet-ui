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
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {Card} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {pluginRegistry} from "plugins/pluginRegistration";
import {reduxForm} from "redux-form";
import PageForm from "components/elements/PageForm";

const EntryForm = reduxForm({
  form: "EntryForm"
})(PageForm);

class _AddEntry extends Component {
  componentDidMount() {
    // reminder: load epcis Entrys for refresh later.
  }
  render() {
    let editMode = this.props.entry ? true : false;
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.epcis.addEntry" />
          ) : (
            <FormattedMessage id="plugins.epcis.editEntry" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.epcis.addEntry" />
              ) : (
                <FormattedMessage id="plugins.epcis.editEntry" />
              )}
            </h5>
            <EntryForm
              edit={editMode}
              operationId={
                editMode ? "epcis_entries_update" : "epcis_entries_create"
              }
              objectName="entry"
              redirectPath={`/epcis`}
              djangoPath="epcis/entries"
              existingValues={this.props.entry || {}}
              parameters={this.props.entry ? {id: this.props.entry.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddEntry = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID]
  };
}, {})(_AddEntry);
