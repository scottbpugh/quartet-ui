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
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage} from "react-intl";
import {Callout, Card} from "@blueprintjs/core";

const DashboardRight = props => (
  <div className="cards-container">
    {/*<Card>
      <h5>Welcome</h5>
      <Callout>
        Use the navigation tree on the left to start using a QU4RTET server.
      </Callout>
    </Card>*/}
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
