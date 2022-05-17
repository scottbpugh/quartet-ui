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

const MessageForm = reduxForm({
  form: "MessageForm"
})(PageForm);

class _AddMessage extends Component {
  componentDidMount() {
    // reminder: load epcis Messages for refresh later.
  }

  render() {
    const editMode = !!this.props.message;
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.epcis.addMessage" />
          ) : (
            <FormattedMessage id="plugins.epcis.editMessage" />
          )
        }
      >
        <div className="large-cards-container">
          <Card className="form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.epcis.addMessage" />
              ) : (
                <FormattedMessage id="plugins.epcis.editMessage" />
              )}
            </h5>
            <MessageForm
              edit={editMode}
              operationId={
                editMode ? "epcis_messages_update" : "epcis_messages_create"
              }
              objectName="message"
              redirectPath="/epcis"
              djangoPath="epcis/messages"
              existingValues={this.props.message || {}}
              parameters={this.props.message ? {id: this.props.message.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddMessage = connect((state, ownProps) => {
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID]
  };
}, {})(_AddMessage);
