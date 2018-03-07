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
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {saveServer} from "reducers/serversettings";
import {pluginRegistry} from "plugins/pluginRegistration";
import {Card, Intent, Tag, Icon, Button} from "@blueprintjs/core";
import "./server-details.css";
import {Server} from "lib/servers";
import {ServerForm} from "./ServerForm";

class _ServerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {editMode: false};
  }
  componentDidMount() {
    console.log("current server", this.props.match.params.serverID);
    let serverObject = pluginRegistry.getServer(this.props.server.serverID);
    if (serverObject) {
      serverObject.listApps();
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log("current server", this.props.server, nextProps.server);
    console.log("next server", nextProps.match.params.serverID);
    let serverObject = pluginRegistry.getServer(this.props.server.serverID);
    if (serverObject) {
      serverObject.listApps();
    }
  }
  toggleEditMode = () => {
    this.setState({editMode: !this.state.editMode});
  };
  render() {
    let serverObject = pluginRegistry.getServer(this.props.server.serverID);
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="nav.app.serverDetails"
            defaultMessage="Server Details"
          />
        }>
        {serverObject ? (
          <div className="cards-container">
            <Card className="pt-elevation-4">
              <h5>
                Settings
                <Button
                  onClick={this.toggleEditMode}
                  className="pt-intent-primary add-pool-button"
                  iconName="pt-icon-edit">
                  Edit
                </Button>
              </h5>
              {this.state.editMode ? (
                <ServerForm
                  defaultValues={serverObject.toJSON()}
                  formData={serverObject.getFormStructure()}
                  saveButtonMsg={
                    <FormattedMessage id="app.servers.updateServer" />
                  }
                />
              ) : (
                <div>
                  <h6>{serverObject.url}</h6>
                  <table className="pt-table pt-bordered pt-striped">
                    <thead>
                      <tr>
                        <th />
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {serverObject.getArrayFields().map(elem => {
                        console.log(elem);
                        return (
                          <tr key={elem.name}>
                            <td>{elem.name}</td>
                            <td>{"" + elem.value}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card className="pt-elevation-4">
              <h5>Services Enabled</h5>
              <div className="service-list">
                {serverObject.appList
                  .filter(service => {
                    // remove empty string.
                    return service;
                  })
                  .map(service => {
                    return <span>{service}</span>;
                  })}
              </div>
            </Card>
          </div>
        ) : null}
      </RightPanel>
    );
  }
}

export var ServerDetails = connect(
  (state, ownProps) => ({
    server: state.serversettings.servers[ownProps.match.params.serverID]
  }),
  {
    saveServer
  }
)(_ServerDetails);
