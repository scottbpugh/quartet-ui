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

const EventForm = reduxForm({
  form: "eventForm"
})(PageForm);

class _AddEvent extends Component {
  componentDidMount() {
    // reminder: load epcis events for refresh later.
  }
  render() {
    let editMode = this.props.event ? true : false;
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.epcis.addEvent" />
          ) : (
            <FormattedMessage id="plugins.epcis.editEvent" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.epcis.addEvent" />
              ) : (
                <FormattedMessage id="plugins.epcis.editEvent" />
              )}
            </h5>
            <EventForm
              edit={editMode}
              operationId={
                editMode ? "epcis_events_update" : "epcis_events_create"
              }
              objectName="event"
              redirectPath={`/epcis`}
              djangoPath="epcis/events"
              existingValues={this.props.event || {}}
              parameters={this.props.event ? {id: this.props.event.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddEvent = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID]
  };
}, {})(_AddEvent);
