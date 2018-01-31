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
import {loadRegions} from "../reducers/numberrange";
import {
  Panels,
  RightPanel,
  LeftPanel
} from "../../../../components/layouts/Panels";
import {Card} from "@blueprintjs/core";
import moment from "moment";
import RegionRange from "./RegionRange";
import "../style.css";

class _RegionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {alloc: 0};
    this.currentPool = {readable_name: ""};
  }
  componentDidMount() {
    let nrServer = this.props.nr[this.props.match.params.serverID];
    for (let pool of nrServer.pools) {
      if (pool.machine_name == this.props.match.params.pool) {
        this.currentPool = pool;
      }
    }
    this.props.loadRegions(nrServer.server, this.currentPool);
  }
  previewAlloc = evt => {
    this.setState({alloc: Number(evt.target.value)});
  };
  render() {
    let regions = this.props.currentRegions;

    return (
      <Panels title={`Pool ${this.currentPool.readable_name} Regions`}>
        <LeftPanel>
          <div className="mini-form">
            <h6>Pool Allocation</h6>
            <input
              placeholder="allocate"
              className="pt-input"
              type="number"
              defaultValue={1}
              min={1}
              max={100000}
              style={{width: 200}}
              onChange={this.previewAlloc.bind(this)}
            />
            <button className="pt-button">Allocate to Pool</button>
          </div>
          <div className="mini-form">
            <h6>Add a New Region</h6>
          </div>
        </LeftPanel>

        <RightPanel>
          <div className="cards-container">
            {regions.map(region => (
              <Card key={region.machine_name}>
                <h5>{region.readable_name}</h5>
                <ul>
                  <li>{moment(region.created_date).format("LL")}</li>
                  <li>{region.active ? "Active" : "Inactive"}</li>
                  <li>
                    {region.start} to {region.end}
                  </li>
                  <li>{region.state}</li>
                </ul>
                <RegionRange
                  start={region.start}
                  end={region.end}
                  state={region.state}
                  alloc={this.state.alloc}
                />
              </Card>
            ))}
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
      currentRegions: state.numberrange.currentRegions,
      nr: state.numberrange.servers
    };
  },
  {loadRegions}
)(_RegionDetail);
