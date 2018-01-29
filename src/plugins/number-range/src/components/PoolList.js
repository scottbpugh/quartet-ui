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
import {
  Panels,
  RightPanel,
  LeftPanel
} from "../../../../components/layouts/Panels";
import {loadPools} from "../reducers/numberrange";
import {Card} from "@blueprintjs/core";
import moment from "moment";

class ServerPools extends Component {
  render() {
    return (
      <Card>
        <h4>Server: {this.props.serverName}</h4>
        <div>
          <table className="pt-table pt-bordered pt-striped">
            <thead>
              <tr>
                <th>Created on</th>
                <th>Readable Name</th>
                <th>Machine Name</th>
                <th>Status</th>
                <th>Request Threshold</th>
              </tr>
            </thead>
            <tbody>
              {this.props.pools.map(pool => (
                <tr>
                  <td>{moment(pool.created_date).format("LL")}</td>
                  <td>{pool.readable_name}</td>
                  <td>{pool.machine_name}</td>
                  <td>{pool.active ? "active" : "inactive"}</td>
                  <td>{pool.request_threshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }
}

class _PoolList extends Component {
  componentDidMount() {
    if (this.props.servers.length > 0) {
      for (let server of this.props.servers) {
        this.props.loadPools(server);
      }
    }
  }
  render() {
    return (
      <Panels title="Number Range Pools">
        <LeftPanel>
          <ul>{Object.keys(this.props.pools).map(key => <li>{key}</li>)}</ul>
        </LeftPanel>
        <RightPanel>
          <div className="cards-container">
            {Object.keys(this.props.pools).map((key, index) => (
              <ServerPools serverName={key} pools={this.props.pools[key]} />
            ))}
          </div>
        </RightPanel>
      </Panels>
    );
  }
}

export var PoolList = connect(
  state => {
    return {
      servers: state.serversettings.servers,
      pools: state.numberrange.pools
    };
  },
  {loadPools}
)(_PoolList);
