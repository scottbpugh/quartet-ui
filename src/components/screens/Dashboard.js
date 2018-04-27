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

const DashboardRight = props => (
  <div className="dashboard-container">
    {/*<Card>
      <h5>Welcome</h5>
      <Callout>
        Use the navigation tree on the left to start using a QU4RTET server.
      </Callout>
    </Card>*/}
    <h2>QU4RTET</h2>
    <h3>The Open Source Level 4</h3>
    <div>
      <Large4 />
      <h4>Start</h4>
      <ul>
        <li>
          <a href="blob">Add a New Server</a>
        </li>
        <li>
          <a href="blob">Install a Plugin</a>
        </li>
      </ul>
    </div>
    <div>
      <h4>Resources &amp; Documentation</h4>
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
            EPCPyYes
          </a>
        </li>
        <li>
          <a href="https://serial-lab.gitlab.io/quartet_epcis/" target="_blank">
            QU4RTET EPCIS
          </a>
        </li>
      </ul>
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
