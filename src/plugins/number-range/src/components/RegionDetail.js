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
import {loadPools, loadRegions} from "../reducers/numberrange";
import {RightPanel} from "components/layouts/Panels";
import {
  Card,
  Callout,
  Tag,
  Intent,
  Button,
  ButtonGroup,
  AnchorButton
} from "@blueprintjs/core";
import RegionRange from "./RegionRange";
import classNames from "classnames";
import {FormattedDate, FormattedMessage, FormattedNumber} from "react-intl";
import {pluginRegistry} from "plugins/pluginRegistration";
import {RegionCard} from "./RegionCard";

import "../style.css";
/**
 * _RegionDetail - Description
 * @extends Component
 */
class _RegionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {alloc: 1, lastUpdated: null};
    // these two properties below make it easy to retrieve
    // and trigger actions.
    this.currentPool = {readable_name: ""};
  }
  componentDidMount() {
    //this.props.loadPools(this.props.servers[this.props.match.params.serverID]);
    this.loadPoolDetail(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.pool !== this.props.match.params.pool) {
      this.loadPoolDetail(nextProps);
      return;
    }
    if (JSON.stringify(this.currentPool) !== JSON.stringify(this.currentPool)) {
      //this.props.loadPools(nextProps.servers[nextProps.match.params.serverID]);
    }
  }
  previewAlloc = evt => {
    this.setState({alloc: Number(evt.target.value)});
  };
  loadPoolDetail(props) {
    for (let pool of this.props.pools) {
      if (pool.machine_name === props.match.params.pool) {
        this.currentPool = pool;
      }
    }
    this.props.loadRegions(
      pluginRegistry.getServer(props.server.serverID),
      this.currentPool
    );
  }

  render() {
    let regions = this.props.currentRegions;

    return (
      <RightPanel
        title={
          <FormattedMessage
            id="plugins.numberRange.regionDetailTitle"
            values={{poolName: this.currentPool.readable_name}}
          />
        }>
        <div className="auto-cards-container">
          {regions && regions.length > 0 ? (
            regions.map(region => (
              <RegionCard
                lastUpdated={this.state.lastUpdated}
                region={region}
                alloc={this.state.alloc}
                pool={this.currentPool}
                serverID={this.props.server.serverID}
                serverObject={pluginRegistry.getServer(
                  this.props.server.serverID
                )}
                history={this.props.history}
              />
            ))
          ) : (
            <Callout>
              <div className="pt-running-text">
                <FormattedMessage id="plugins.numberRange.noRegionInPool" />
              </div>
            </Callout>
          )}
        </div>
      </RightPanel>
    );
    //<div>{JSON.stringify(this.props.region)}</div>;
  }
}

export var RegionDetail = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      pools: state.numberrange.servers[ownProps.match.params.serverID].pools,
      currentRegions: state.numberrange.currentRegions
    };
  },
  {loadPools, loadRegions}
)(_RegionDetail);
