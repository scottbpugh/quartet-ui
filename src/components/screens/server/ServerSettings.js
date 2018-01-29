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
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {saveServer, loadCurrentServer} from "../../../reducers/serversettings";

const formStructure = (initialValues = {}) => ({
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
      value: initialValues.serverSettingName || "",
      elemtype: "input"
    }
  },
  serverID: {
    input: {
      id: "server-id",
      name: "serverID",
      className: "pt-input",
      type: "hidden",
      elemtype: "input",
      defaultValue: initialValues.serverID || ""
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
      value: initialValues.serverName || "",
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
      value: initialValues.port || "",
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
      value: initialValues.path || "",
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
      type: "checkbox",
      checked: initialValues.ssl || false,
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
      value: initialValues.username || "",
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
      elemtype: "input",
      value: initialValues.password || ""
    }
  }
});
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
    // using simple div when no wrapper (hidden input, ...)
    let formGroup = data.wrapper ? (
      <FormGroup
        helperText={data.wrapper.helperText}
        label={data.wrapper.label}
        labelFor={data.wrapper.labelFor}
        key={data.wrapper.labelFor}>
        {elem}
      </FormGroup>
    ) : (
      <div>{elem}</div>
    );
    formElems.push(formGroup);
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
  constructor(props) {
    super(props);
    this.state = {postData: {}};
  }

  saveServer = evt => {
    evt.preventDefault();
    let form = evt.target;
    let postData = {};

    for (let item of form) {
      if (item.name) {
        postData[item.name] = item.value;
      }
    }
    this.props.saveServer(postData);
  };
  componentDidMount() {
    console.log("triggered", this.props.match.params.serverID);
    this.loadCurrentServer(this.props.match.params.serverID);
  }
  componentWillReceiveProps(nextProps) {
    console.log("triggered", this.props.match.params.serverID);
    this.loadCurrentServer(nextProps.match.params.serverID);
  }
  loadCurrentServer = serverID => {
    if (serverID) {
      console.log("servers are", this.props.servers);
      if (serverID in this.props.servers) {
        this.setState({postData: {...this.props.servers[serverID]}}, () => {});
      }
    }
  };

  updateValue = evt => {
    this.setState(
      {
        postData: {...this.state.postData, [evt.target.name]: evt.target.value}
      },
      () => {
        console.log("state is", this.state);
      }
    );
    // validation should happen here.
    if (evt.target.type === "checkbox") {
      // for checkboxes we passed checked prop instead.
      //this.props.updateValue(evt.target.name, evt.target.checked);
    } else {
      //this.props.updateValue(evt.target.name, evt.target.value);
    }
  };

  SettingsForm = props => {
    return (
      <div className="settings-form-container">
        <Card>
          <h5>Connect to a Server</h5>
          {ServerForm(
            formStructure(this.state.postData),
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

  render() {
    console.log("state is", this.state);
    const SettingsMenu = props => {
      let serverList = Object.keys(props.servers).map(key => {
        return (
          <li key={props.servers[key].serverID}>
            <Link to={`/server-settings/${props.servers[key].serverID}`}>
              {props.servers[key].serverSettingName}
            </Link>
          </li>
        );
      });
      return (
        <div>
          <ul>{serverList}</ul>
          <Link to="/server-settings/">
            <button>New Server</button>
          </Link>
        </div>
      );
    }; // leaving empty for now.

    return (
      <Panels
        title="Server Settings"
        leftPanel={SettingsMenu(this.props)}
        rightPanel={this.SettingsForm()}
      />
    );
  }
}

_ServerSettings.propTypes = {
  servers: PropTypes.array
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
