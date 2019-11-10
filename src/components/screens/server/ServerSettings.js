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
import PropTypes from "prop-types";
import {RightPanel} from "../../layouts/Panels";
import "./server-settings.css";
import {Card} from "@blueprintjs/core";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {Server} from "lib/servers";
import {ServerForm} from "./ServerForm";

class _ServerSettings extends Component {
  submitCallback = postValues => {
    this.props.history.push(`/server-details/${postValues.serverID}`);
  };

  SettingsForm = props => {
    return (
      <div className="large-cards-container">
        <Card className="bp3-elevation-4 form-card">
          <h5 className="bp3-heading">Connect to a Server</h5>
          <ServerForm
            defaultValues={{tokenType: "Token"}}
            formData={Server.getFormStructure()}
            saveButtonMsg={<FormattedMessage id="app.servers.addServer" />}
            submitCallback={this.submitCallback}
          />
        </Card>
      </div>
    );
  };

  render() {
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="app.serverSettings.serverSettings"
            defaultMessage="Server Settings"
          />
        }>
        {this.SettingsForm()}
      </RightPanel>
    );
  }
}

_ServerSettings.propTypes = {
  servers: PropTypes.object
};

export var ServerSettings = connect(state => ({
  servers: state.serversettings.servers
}))(_ServerSettings);
