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
import {connect} from "react-redux";
import {loadRegion} from "../reducers/numberrange";
import {
  Panels,
  RightPanel,
  LeftPanel
} from "../../../../components/layouts/Panels";
import {Card} from "@blueprintjs/core";
import moment from "moment";

const t = {
  pool: "poolbot",
  created_date: "2018-01-29T23:01:34.586281Z",
  modified_date: "2018-01-29T23:01:34.586309Z",
  readable_name: "test",
  machine_name: "test",
  active: true,
  order: 1,
  start: 1,
  end: 10000,
  state: 1
};

class _RegionDetail extends Component {
  componentDidMount() {
    this.props.loadRegion(
      this.props.servers[this.props.match.params.serverID],
      this.props.match.params.region
    );
  }
  render() {
    let region = this.props.region;
    return (
      <Panels title="Pool Region">
        <LeftPanel />

        <RightPanel>
          <div className="cards-container">
            <Card>
              <h5>Region Name</h5>
              {region.readable_name}
            </Card>
            <Card>
              <h5>Created Date</h5>
              {moment(region.created_date).format("LL")}
            </Card>
            <Card>
              <h5>Active</h5>
              {region.active}
            </Card>
            <Card>
              <h5>Range</h5>
              Start: {region.start}
              <br />
              End: {region.end}
              <br />
              State: {region.state}
              <br />
            </Card>
          </div>
        </RightPanel>
      </Panels>
    );

    //<div>{JSON.stringify(this.props.region)}</div>;
  }
}

export var RegionDetail = connect(
  (state, ownProps) => {
    return {
      servers: state.serversettings.servers,
      region: state.numberrange.region
    };
  },
  {loadRegion}
)(_RegionDetail);
