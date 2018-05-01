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
import "components/cards/dashboard/cards.css";
import {Card, Callout} from "@blueprintjs/core";
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage} from "react-intl";
import {Large4} from "./Large4";
import "./Dashboard.css";
import {withRouter} from "react-router";

class _DashboardRight extends Component {
  goTo = path => {
    this.props.history.push(path);
  };
  render() {
    const {props} = this;
    return (
      <div className="dashboard-container">
        <h2>QU4RTET</h2>
        <h3>
          <FormattedMessage id="app.dashboard.dashboardHeader3" />
        </h3>
        <Large4 />
        <div className="dashboard-actions-groups">
          <div className="dashboard-items-container">
            <div className="dashboard-items">
              <div className="dashboard-actions-group">
                <h4>
                  <FormattedMessage id="app.dashboard.start" />
                </h4>
                <ul>
                  <li>
                    <a onClick={this.goTo.bind(this, "/server-settings/")}>
                      <FormattedMessage id="app.serverSettings.addAServer" />
                    </a>
                  </li>
                  <li>
                    <a onClick={this.goTo.bind(this, "/plugins")}>
                      <FormattedMessage id="app.plugins.addPlugin" />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="dashboard-actions-group">
                <h4>
                  <FormattedMessage id="app.dashboard.resourcesDocumentation" />
                </h4>
                <ul>
                  <li>
                    <a href="http://serial-lab.com" target="_blank">
                      Serial Lab
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://serial-lab.gitlab.io/EPCPyYes/"
                      target="_blank">
                      <FormattedMessage
                        id="app.dashboard.documentation"
                        values={{projectName: "EPCPyYes"}}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://serial-lab.gitlab.io/EParseCIS/readme.html"
                      target="_blank">
                      <FormattedMessage
                        id="app.dashboard.documentation"
                        values={{projectName: "EParseCIS"}}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://serial-lab.gitlab.io/quartet_epcis/"
                      target="_blank">
                      <FormattedMessage
                        id="app.dashboard.documentation"
                        values={{projectName: "EPCIS Module"}}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://serial-lab.gitlab.io/serialbox/"
                      target="_blank">
                      <FormattedMessage
                        id="app.dashboard.documentation"
                        values={{projectName: "Number Range Module"}}
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="dashboard-items">
              <div className="dashboard-actions-group">
                <h4>
                  <FormattedMessage id="app.dashboard.servers" />
                </h4>
                <ul>
                  {this.props.servers &&
                  Object.keys(this.props.servers).length > 0 ? (
                    Object.keys(this.props.servers).map(serverID => {
                      return (
                        <li>
                          <a
                            onClick={this.goTo.bind(
                              this,
                              `/server-details/${serverID}/`
                            )}>
                            {this.props.servers[serverID].serverSettingName}
                          </a>
                        </li>
                      );
                    })
                  ) : (
                    <li>
                      <FormattedMessage id="app.dashboard.noServerFound" />
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const DashboardRight = connect((state, ownProps) => {
  return {servers: state.serversettings.servers};
}, {})(withRouter(_DashboardRight));

export default props => {
  return (
    <RightPanel
      key="dashboard"
      title={<FormattedMessage id="app.nav.dashboard" />}>
      <DashboardRight />
    </RightPanel>
  );
};
