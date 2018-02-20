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
import {FormGroup, Switch, Card, Button} from "@blueprintjs/core";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {saveServer, loadCurrentServer} from "../../../reducers/serversettings";
import {FormattedMessage} from "react-intl";
import {DefaultField, getSyncValidators} from "components/elements/forms";
import {Field, reduxForm, change} from "redux-form";

const formStructure = (initialValues = {}) => [
  {
    name: "serverSettingName",
    description: {
      type: "text",
      required: true,
      read_only: false,
      label: "Server Setting Name",
      help_text:
        "The label that will be used for this server connection setting."
    }
  },
  {
    name: "serverID",
    description: {
      type: "hidden",
      required: false,
      read_only: false,
      label: "Server ID",
      help_text: "Hidden Server ID"
    }
  },
  {
    name: "serverName",
    description: {
      type: "text",
      required: true,
      read_only: false,
      label: "Server Hostname",
      help_text:
        "A hostname or IP address, example localhost, serial-box.com, or 192.168.5.10."
    }
  },
  {
    name: "port",
    description: {
      type: "number",
      required: true,
      read_only: false,
      label: "Port Number",
      min_value: 1,
      max_value: 65535,
      help_text: "A port to connect to. Example, 80, 8080, 443, ..."
    }
  },
  {
    name: "path",
    description: {
      type: "text",
      required: false,
      read_only: false,
      label: "Root Path",
      helperText: "A path to interact with API (Optional), example /api"
    }
  },
  {
    name: "ssl",
    description: {
      type: "boolean",
      required: false,
      read_only: false,
      label: "SSL/TLS",
      helperText: "SSL/TLS encryption"
    }
  },
  {
    name: "username",
    description: {
      type: "text",
      required: true,
      read_only: false,
      label: "Username",
      help_text: "Basic Auth Username"
    }
  },
  {
    name: "password",
    description: {
      type: "password",
      required: true,
      read_only: false,
      label: "Password",
      help_text: "Basic Auth Password"
    }
  }
];
/**
 * ServerForm - Description
 *
 * @param {Object} formData        structure representing input.
 * @param {function} saveHandler   callback to save the form
 * @param {function} updateHandler callback to update/validate each input
 *
 * @return {ReactElement} A form element with a series of inputs based on formData.
 */
class _ServerForm extends Component {
  componentDidMount() {
    this.formElems = this.props.formData.map(field => {
      field.validate = getSyncValidators(field);
      if (field.name === "serverSettingName") {
        field.validate.push(this.validateServerName.bind(this));
      }
      return (
        <Field
          key={field.name}
          name={field.name}
          fieldData={field}
          component={DefaultField}
          type={field.description.type}
          className="pt-input"
          width={300}
          validate={field.validate}
        />
      );
    });
  }
  submit = postValues => {
    this.props.saveServer(postValues);
  };
  validateServerName = value => {
    let serverSettingNames = Object.keys(this.props.servers).map(server => {
      return this.props.servers[server].serverSettingName.toLowerCase().trim();
    });
    if (serverSettingNames.includes(value.toLowerCase().trim())) {
      return "Server Setting Name already used.";
    }
    return undefined;
  };
  render() {
    const {handleSubmit, formData} = this.props;

    return (
      <form onSubmit={handleSubmit(this.submit)}>
        {this.formElems}
        <Button
          type="submit"
          className="pt-button pt-intent-primary"
          iconName="add">
          Add Server
        </Button>
      </form>
    );
  }
}
const ServerForm = connect(
  state => ({
    servers: state.serversettings.servers
  }),
  {saveServer, loadCurrentServer}
)(reduxForm({form: "serverForm"})(_ServerForm));

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
          <ServerForm formData={formStructure()} />
        </Card>
      </div>
    );
  };

  SettingsMenu = props => {
    let serverList = Object.keys(props.servers).map(key => {
      return (
        <li key={props.servers[key].serverID}>
          <Link to={`/server-settings/${props.servers[key].serverID}`}>
            {props.servers[key].serverSettingName}
          </Link>
        </li>
      );
    });
    return <div />;
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
