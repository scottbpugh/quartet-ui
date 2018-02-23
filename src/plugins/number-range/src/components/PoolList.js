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
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {loadPools} from "../reducers/numberrange";
import {Card} from "@blueprintjs/core";
import {Link} from "react-router-dom";
import {FormattedMessage, FormattedDate, FormattedNumber} from "react-intl";

class ServerPools extends Component {
  render() {
    let serverName = this.props.server.serverSettingName;
    let serverID = this.props.server.serverID;
    return (
      <Card className="pt-elevation-4">
        <h5>
          <button
            className="pt-button add-pool-button pt-intent-primary"
            onClick={e => {
              this.props.history.push(`/number-range/add-pool/${serverID}/`);
            }}>
            <FormattedMessage id="plugins.numberRange.addPool" />
          </button>
          {serverName}
        </h5>
        <div />
        <div>
          <table className="pool-list-table pt-table pt-bordered pt-striped">
            <thead>
              <tr>
                <th>
                  <FormattedMessage
                    id="plugins.numberRange.createdOn"
                    defaultMessage="Created on"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="plugins.numberRange.readableName"
                    defaultMessage="Readable Name"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="plugins.numberRange.machineName"
                    defaultMessage="Machine Name"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="plugins.numberRange.status"
                    defaultMessage="Status"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="plugins.numberRange.requestThreshold"
                    defaultMessage="Request Threshold"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="plugins.numberRange.regions"
                    defaultMessage="Regions"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(this.props.pools) && this.props.pools.length > 0
                ? this.props.pools.map(pool => (
                    <tr>
                      <td>
                        <FormattedDate
                          value={pool.created_date}
                          day="numeric"
                          month="long"
                          year="numeric"
                        />
                      </td>
                      <td>{pool.readable_name}</td>
                      <td>
                        <Link
                          to={`/number-range/region-detail/${serverID}/${
                            pool.machine_name
                          }`}>
                          {pool.machine_name}
                        </Link>
                      </td>
                      <td>
                        {pool.active ? (
                          <FormattedMessage
                            id="plugins.numberRange.active"
                            defaultMessage="active"
                          />
                        ) : (
                          <FormattedMessage
                            id="plugins.numberRange.inactive"
                            defaultMessage="inactive"
                          />
                        )}
                      </td>
                      <td>
                        <FormattedNumber value={pool.request_threshold} />
                      </td>
                      <td>
                        <Link
                          to={`/number-range/region-detail/${serverID}/${
                            pool.machine_name
                          }/`}>
                          {pool.sequentialregion_set.length}{" "}
                          <FormattedMessage
                            id="plugins.numberRange.regions"
                            defaultMessage="regions"
                          />
                        </Link>
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
      this.props.loadPools(
        this.props.servers[this.props.match.params.serverID]
      );
    }
  }
  render() {
    let nr = this.props.nr;
    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.numberRange.numberRangePools"
            defaultMessage="Number Range Pools"
          />
        }>
        <div className="large-cards-container">
          <ServerPools
            history={this.props.history}
            server={nr[this.props.match.params.serverID].server}
            pools={nr[this.props.match.params.serverID].pools}
          />
        </div>
      </RightPanel>
    );
  }
}

export var PoolList = connect(
  state => {
    return {
      servers: state.serversettings.servers,
      nr: state.numberrange.servers
    };
  },
  {loadPools}
)(_PoolList);
