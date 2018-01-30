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
import {Link} from "react-router-dom";

class ServerPools extends Component {
  render() {
    let serverName = this.props.server.serverSettingName;
    let serverID = this.props.server.serverID;
    return (
      <Card>
        <h4>Server: {serverName}</h4>
        <div>
          <table className="pt-table pt-bordered pt-striped">
            <thead>
              <tr>
                <th>Created on</th>
                <th>Readable Name</th>
                <th>Machine Name</th>
                <th>Status</th>
                <th>Request Threshold</th>
                <th>Regions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(this.props.pools)
                ? this.props.pools.map(pool => (
                    <tr>
                      <td>{moment(pool.created_date).format("LL")}</td>
                      <td>{pool.readable_name}</td>
                      <td>
                        <Link
                          to={`/number-range/region-detail/${
                            pool.machine_name
                          }`}>
                          {pool.machine_name}
                        </Link>
                      </td>
                      <td>{pool.active ? "active" : "inactive"}</td>
                      <td>{pool.request_threshold}</td>
                      <td>
                        {pool.sequentialregion_set.map(region => (
                          <Link
                            to={`/number-range/region-detail/${serverID}/${region}/`}>
                            {region}
                          </Link>
                        ))}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }
}

class _PoolList extends Component {
  componentDidMount() {
    if (Object.keys(this.props.servers).length > 0) {
      for (let key in this.props.servers) {
        this.props.loadPools(this.props.servers[key]);
      }
    }
  }
  render() {
    let nr = this.props.numberrange;
    return (
      <Panels title="Number Range Pools">
        <LeftPanel>
          <ul>
            {Object.keys(nr).map(key => (
              <li>{nr[key].server.serverSettingName}</li>
            ))}
          </ul>
        </LeftPanel>
        <RightPanel>
          <div className="cards-container">
            <div>
              {Object.keys(nr).map(key => (
                <ServerPools server={nr[key].server} pools={nr[key].pools} />
              ))}
            </div>
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
      numberrange: state.numberrange
    };
  },
  {loadPools}
)(_PoolList);
