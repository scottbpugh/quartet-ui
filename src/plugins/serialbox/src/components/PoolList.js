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

import {loadPools} from "../reducers/numberrange";
const React = qu4rtet.require("react");
const {Component} = React;
const {connect} = qu4rtet.require("react-redux");
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {Card} = qu4rtet.require("@blueprintjs/core");
const {FormattedMessage, FormattedDate, FormattedNumber} = qu4rtet.require(
  "react-intl"
);
const {Link} = qu4rtet.require("react-router-dom");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

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
                ? this.props.pools.map(pool => {
                    let regionNumber = 0;
                    if (Number(pool.sequentialregion_set.length)) {
                      regionNumber = Number(pool.sequentialregion_set.length);
                    }
                    if (
                      pool.randomizedregion_set &&
                      Number(pool.randomizedregion_set.length)
                    ) {
                      regionNumber += Number(pool.randomizedregion_set.length);
                    }
                    if (
                      pool.listbasedregion_set &&
                      Number(pool.listbasedregion_set.length)
                    ) {
                      regionNumber += Number(pool.listbasedregion_set.length);
                    }
                    return (
                      <tr key={pool.machine_name}>
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
                            {regionNumber}{" "}
                            <FormattedMessage
                              id="plugins.numberRange.regions"
                              defaultMessage="regions"
                            />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
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
    let {server} = this.props;
    this.props.loadPools(pluginRegistry.getServer(server.serverID));
  }
  render() {
    let {server, pools} = this.props;
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
            server={server}
            pools={pools}
          />
        </div>
      </RightPanel>
    );
  }
}

export var PoolList = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      pools: state.numberrange.servers
        ? state.numberrange.servers[ownProps.match.params.serverID].pools
        : []
    };
  },
  {loadPools}
)(_PoolList);
