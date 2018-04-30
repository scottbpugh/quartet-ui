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

import React from "react";
import "components/cards/dashboard/cards.css";
import {Card} from "@blueprintjs/core";
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage} from "react-intl";
import {Large4} from "./Large4";
import "./Dashboard.css";

const DashboardRight = props => (
  <div className="dashboard-container">
    {/*<Card>
      <h5>Welcome</h5>
      <Callout>
        Use the navigation tree on the left to start using a QU4RTET server.
      </Callout>
    </Card>*/}
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
                <a href="blob">
                  <FormattedMessage id="app.serverSettings.addAServer" />
                </a>
              </li>
              <li>
                <a href="blob">
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
                  href="https://serial-lab.gitlab.io/EPCPyYes/index.html"
                  target="_blank">
                  <FormattedMessage
                    id="app.dashboard.documentation"
                    values={{projectName: "EPCPyYes"}}
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://serial-lab.gitlab.io/quartet_epcis/"
                  target="_blank">
                  <FormattedMessage
                    id="app.dashboard.documentation"
                    values={{projectName: "EPCIS module"}}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="dashboard-items">
          <div className="dashboard-actions-group">
            <h4>
              <FormattedMessage id="app.dashboard.connectServer" />
            </h4>
            <ul>
              <li>
                <a href="http://serial-lab.com" target="_blank">
                  QA Server #1
                </a>
              </li>
              <li>
                <a href="http://serial-lab.com" target="_blank">
                  Prod Server #1
                </a>
              </li>
              <li>
                <a href="http://serial-lab.com" target="_blank">
                  Prod Server #2
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default props => {
  return (
    <RightPanel
      key="dashboard"
      title={<FormattedMessage id="app.nav.dashboard" />}>
      {DashboardRight()}
    </RightPanel>
  );
};
