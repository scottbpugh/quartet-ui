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
import {Card, Button, Icon, Tag, Intent} from "@blueprintjs/core";
import "./server-details.css";
import {ServerForm} from "./ServerForm";

class _ServerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {editMode: false};
  }
  componentDidMount() {
    // retrigger a schema fetch when mounting details.
    this.fetchAppList();
  }
  fetchAppList = evt => {
    let serverObject = pluginRegistry.getServer(this.props.server.serverID);
    if (serverObject) {
      serverObject.listApps();
    }
  };
  fetchAppListRefresh = evt => {
    let serverObject = pluginRegistry.getServer(this.props.server.serverID);
    if (serverObject) {
      serverObject.listApps(true);
    }
  };
  toggleEditMode = () => {
    this.setState({editMode: !this.state.editMode});
  };
  submitCallback = () => {
    // leave form on successful submit.
    this.setState({editMode: false});
  };
  render() {
    let serverObject = pluginRegistry.getServer(this.props.server.serverID);
    let services = serverObject
      ? serverObject.appList
          .filter(service => {
            // remove empty string.
            return service;
          })
          .map(service => {
            return (
              <li key={service}>
                {service}
                <span className="icon-dot" />
              </li>
            );
          })
      : [];
    return (
      <RightPanel title={<FormattedMessage id="app.servers.serverDetails" />}>
        {serverObject ? (
          <div className="cards-container">
            <Card className="bp3-elevation-4">
              <h5>
                Settings
                <Button
                  onClick={this.toggleEditMode}
                  className="bp3-intent-primary add-incard-button"
                  iconName="bp3-icon-edit">
                  Edit
                </Button>
              </h5>
              {this.state.editMode ? (
                <div className="form-card">
                  <ServerForm
                    defaultValues={serverObject.toJSON()}
                    formData={serverObject.getFormStructure()}
                    saveButtonMsg={
                      <FormattedMessage id="app.servers.updateServer" />
                    }
                    submitCallback={this.submitCallback}
                  />
                </div>
              ) : (
                <div>
                  <table className="bp3-table bp3-bordered bp3-striped">
                    <thead>
                      <tr>
                        <th>Server API Endpoint</th>
                        <th>
                          <h6>
                            <Tag intent={Intent.PRIMARY}>
                              <a
                                style={{color: "#FFF"}}
                                href={serverObject.url}
                                target="_blank">
                                {serverObject.url}
                              </a>
                            </Tag>
                          </h6>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {serverObject.getArrayFields().map(elem => {
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
            <Card className="bp3-elevation-4">
              <h5>
                Services Enabled{" "}
                <Button
                  onClick={this.fetchAppListRefresh}
                  iconName="bp3-icon-refresh add-incard-button"
                />
              </h5>
              {services.length > 0 ? (
                <ul className="service-list">{services}</ul>
              ) : (
                <div onClick={this.fetchAppList} className="centered-action">
                  <Icon
                    iconName="bp3-icon-refresh"
                    className="very-large-icon"
                  />
                  <span>Retry</span>
                </div>
              )}
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
