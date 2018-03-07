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
import {Card, Button} from "@blueprintjs/core";
import {connect} from "react-redux";
import {saveServer, loadCurrentServer} from "../../../reducers/serversettings";
import {FormattedMessage} from "react-intl";
import {DefaultField, getSyncValidators} from "components/elements/forms";
import {Field, reduxForm} from "redux-form";
import {Server} from "lib/servers";
import {ServerForm} from "./ServerForm";

class _ServerSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {postData: {}};
  }

  componentDidMount() {
    this.loadCurrentServer(this.props.match.params.serverID);
  }

  componentWillReceiveProps(nextProps) {
    this.loadCurrentServer(nextProps.match.params.serverID);
  }

  loadCurrentServer = serverID => {
    if (serverID) {
      if (serverID in this.props.servers) {
        this.setState({postData: {...this.props.servers[serverID]}}, () => {});
      }
    }
  };

  updateValue = evt => {
    // validation should happen here.
    if (evt.target.type === "checkbox") {
      // for checkboxes we passed checked prop instead.

      this.setState({
        postData: {
          ...this.state.postData,
          [evt.target.name]: evt.target.checked
        }
      });
      //this.props.updateValue(evt.target.name, evt.target.checked);
    } else {
      //this.props.updateValue(evt.target.name, evt.target.value);
      this.setState({
        postData: {...this.state.postData, [evt.target.name]: evt.target.value}
      });
    }
  };

  SettingsForm = props => {
    return (
      <div className="large-cards-container">
        <Card className="pt-elevation-4 form-card">
          <h5>Connect to a Server</h5>
          <ServerForm
            formData={Server.getFormStructure()}
            saveButtonMsg={<FormattedMessage id="app.servers.addServer" />}
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

export var ServerSettings = connect(
  state => ({
    servers: state.serversettings.servers
  }),
  {
    saveServer,
    loadCurrentServer
  }
)(_ServerSettings);
