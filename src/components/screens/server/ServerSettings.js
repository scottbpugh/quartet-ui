// Copyright (c) 2018 Serial Lab
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
import {Panels} from "../../layouts/Panels";
import "./server-settings.css";
import {FormGroup, Switch, Card, Button} from "@blueprintjs/core";
import {connect} from "react-redux";
import {saveServer, updateValue} from "../../../reducers/serversettings";

/**
 * initialData - Returns the initial data for
 * the Redux store for this form.
 * Used in index.js to initialized the store.
 *
 * It is a JSON-serializable object representing the form
 */
export const initialData = {
  servers: [],
  currentServer: null,
  formData: {
    serverSettingName: {
      wrapper: {
        helperText:
          "The label that will be used for this server connection setting.",
        label: "Server Setting Name",
        labelFor: "serversetting-name"
      },
      input: {
        id: "serversetting-name",
        name: "serverSettingName",
        className: "pt-input",
        placeholder: "Server/Connection Name",
        type: "text",
        value: "",
        elemtype: "input"
      }
    },
    serverName: {
      wrapper: {
        helperText:
          "A hostname or IP address, example localhost, serial-box.com, or 192.168.5.10.",
        label: "Server Hostname",
        labelFor: "server-name"
      },
      input: {
        id: "server-name",
        name: "serverName",
        className: "pt-input",
        placeholder: "Server Hostname",
        required: true,
        value: "",
        type: "text",
        elemtype: "input"
      }
    },
    port: {
      wrapper: {
        helperText: "A port to connect to. Example, 80, 8080, 443, ...",
        label: "Port Number",
        labelFor: "port-number"
      },
      input: {
        id: "port-number",
        name: "port",
        type: "number",
        min: "1",
        max: "65000",
        className: "pt-input",
        placeholder: "Port Number",
        required: true,
        value: "",
        elemtype: "input"
      }
    },
    path: {
      wrapper: {
        helperText: "A path required to interact with API (Optional)",
        label: "Root Path",
        labelFor: "root-path"
      },
      input: {
        id: "root-path",
        name: "path",
        className: "pt-input",
        placeholder: "Root Path",
        value: "",
        type: "text",
        elemtype: "input"
      }
    },
    ssl: {
      wrapper: {
        helperText: "SSL/TLS encryption",
        label: "SSL/TLS",
        labelFor: "ssl"
      },
      input: {
        name: "ssl",
        Label: "SSL/TLS",
        value: false,
        type: "checkbox",
        checked: false,
        elemtype: "Switch"
      }
    },
    username: {
      wrapper: {
        helperText: "Basic Auth Username",
        label: "Username",
        name: "username",
        labelFor: "username"
      },
      input: {
        id: "username",
        name: "username",
        className: "pt-input",
        placeholder: "Username",
        required: true,
        value: "",
        type: "text",
        elemtype: "input"
      }
    },
    password: {
      wrapper: {
        helperText: "Basic Auth Password",
        label: "Password",
        name: "password",
        labelFor: "password"
      },
      input: {
        id: "password",
        name: "password",
        className: "pt-input",
        placeholder: "Password",
        type: "password",
        required: true,
        elemtype: "input"
      }
    }
  }
};

/**
 * ServerForm - Description
 *
 * @param {Object} formData        check initialData().formData.
 * @param {function} saveHandler   callback to save the form
 * @param {function} updateHandler callback to update/validate each input
 *
 * @return {ReactElement} A form element with a series of inputs based on formData.
 */
const ServerForm = (formData, saveHandler, updateHandler) => {
  const formElems = [];
  for (let key in formData) {
    let data = formData[key];
    let elem;
    if (data.input.elemtype === "input") {
      elem = (
        <input
          {...data.input}
          style={{width: 300}}
          required={data.input.required || false}
          onChange={updateHandler}
        />
      );
    } else if (data.input.elemtype === "Switch") {
      elem = (
        <Switch
          {...data.input}
          checked={data.input.value}
          onChange={updateHandler}
        />
      );
    }
    formElems.push(
      <FormGroup
        helperText={data.wrapper.helperText}
        label={data.wrapper.label}
        labelFor={data.wrapper.labelFor}
        key={data.wrapper.labelFor}>
        {elem}
      </FormGroup>
    );
  }
  return (
    <form onSubmit={saveHandler}>
      {formElems}
      <Button type="submit" iconName="add">
        Add Server
      </Button>
    </form>
  );
};

class _ServerSettings extends Component {
  validateForm = formData => {};

  saveServer = evt => {
    evt.preventDefault();
    let form = evt.target;
    let formData = {};

    for (let item of form) {
      if (item.name) {
        formData[item.name] = item.value;
      }
    }
    this.props.saveServer(formData);
  };

  updateValue = evt => {
    if (evt.target.type === "checkbox") {
      // for checkboxes we passed checked prop instead.
      this.props.updateValue(evt.target.name, evt.target.checked);
    } else {
      this.props.updateValue(evt.target.name, evt.target.value);
    }
  };

  testInput = evt => {
    evt.preventDefault();
  };

  render() {
    const SettingsMenu = props => {
      let serverList = props.servers.map((server, index) => {
        return <li key={index}>{server.serverSettingName}</li>;
      });
      return <ul>{serverList}</ul>;
    }; // leaving empty for now.

    const SettingsForm = props => {
      let formData = this.props.formData;
      return (
        <div className="settings-form-container">
          <Card>
            <h5>Connect to a Server</h5>
            {ServerForm(
              formData,
              this.saveServer.bind(this),
              this.updateValue.bind(this)
            )}
          </Card>
          <Card>
            <h5>Connection test &amp; Server Info</h5>
          </Card>
        </div>
      );
    };
    return (
      <Panels
        title="Server Settings"
        leftPanel={SettingsMenu(this.props)}
        rightPanel={SettingsForm()}
      />
    );
  }
}

_ServerSettings.propTypes = {
  servers: PropTypes.array,
  formData: PropTypes.object
};

export var ServerSettings = connect(
  state => ({
    servers: state.serversettings.servers,
    formData: state.serversettings.formData
  }),
  {
    saveServer,
    updateValue
  }
)(_ServerSettings);
