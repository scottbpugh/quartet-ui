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
import LatestGTINs from "components/cards/dashboard/LatestGTINs";
import ItemsProcessedByDate from "components/cards/dashboard/ItemsProcessedByDate";
import NotificationsDisplay from "components/cards/dashboard/NotificationsDisplay";
import ItemLookup from "components/cards/dashboard/ItemLookup";
import {FormattedMessage} from "react-intl";

const DashboardRight = props => (
  <div className="cards-container">
    <Card className="pt-elevation-3">
      <h5>Notifications</h5>
      <NotificationsDisplay />
    </Card>
    <Card className="pt-elevation-3">
      <h5>Items processed by month</h5>
      <ItemsProcessedByDate />
    </Card>
    <Card className="pt-elevation-3">
      <h5>Latest items processed</h5>
      <LatestGTINs />
    </Card>
    <Card className="pt-elevation-3">
      <h5>Item Lookup</h5>
      <ItemLookup />
    </Card>
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
