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
import RegionRange from "./RegionRange";
import {setAllocation} from "../reducers/numberrange";
import "../style.css";
import classNames from "classnames";
import {FormattedDate, FormattedMessage, FormattedNumber} from "react-intl";
import NRTree from "./NRTree";
import PropTypes from "prop-types";

/**
 * _RegionDetail - Description
 * @extends Component
 */
class _RegionDetail extends Component {
  /*static propTypes = {
    history: PropTypes.object.isRequired
  };*/
  constructor(props) {
    super(props);
    this.state = {alloc: 1, lastUpdated: null};
    // these two properties below make it easy to retrieve
    // and trigger actions.
    this.currentPool = {readable_name: ""};
    this.currentServer = {};
  }
  componentDidMount() {
    this.loadPoolDetail(this.props);
  }
  previewAlloc = evt => {
    this.setState({alloc: Number(evt.target.value)});
  };
  loadPoolDetail(props) {
    let nrServer = props.nr[props.match.params.serverID];
    this.currentServer = nrServer.server;
    for (let pool of nrServer.pools) {
      if (pool.machine_name === props.match.params.pool) {
        this.currentPool = pool;
      }
    }
    this.props.loadRegions(this.currentServer, this.currentPool);
  }
  setAllocation = evt => {
    this.props.setAllocation(
      this.currentServer,
      this.currentPool,
      this.state.alloc
    );
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.pool != this.props.match.params.pool) {
      console.log("me next props", typeof nextProps);
      this.loadPoolDetail(nextProps);
    }
    // shake card for the last updated region.
    nextProps.currentRegions.map((region, index) => {
      if (
        this.props.currentRegions[index] &&
        region.state !== this.props.currentRegions[index].state
      ) {
        this.setState({lastUpdated: region.machine_name}, () => {
          window.setTimeout(() => {
            this.setState({lastUpdated: null});
          }, 3000);
        });
      }
      return null;
    });
  }

  render() {
    let regions = this.props.currentRegions;

    return (
      <Panels title={`Pool ${this.currentPool.readable_name} Regions`}>
        <LeftPanel>
          <div className="mini-form">
            <h6>
              <FormattedMessage id="plugins.numberRange.allocation" />
            </h6>
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
            <button onClick={this.setAllocation} className="pt-button">
              <FormattedMessage id="plugins.numberRange.allocateButton" />
            </button>
          </div>
          <div className="mini-form">
            <button
              className="pt-button"
              onClick={e => {
                this.props.history.push(
                  `/number-range/add-region/${this.currentServer.serverID}/${
                    this.currentPool.machine_name
                  }`
                );
              }}>
              <FormattedMessage id="plugins.numberRange.addRegion" />
            </button>
          </div>
          <NRTree nr={this.props.nr} />
        </LeftPanel>

        <RightPanel>
          <div className="auto-cards-container">
            {regions.map(region => (
              <Card
                className={classNames({
                  "pt-elevation-4": true,
                  "region-detail": true,
                  updated: this.state.lastUpdated === region.machine_name
                })}
                key={region.machine_name}>
                <h5>{region.readable_name}</h5>
                <ul>
                  <li>
                    <FormattedMessage id="plugins.numberRange.createdOn" />:{" "}
                    <FormattedDate value={region.created_date} />
                  </li>
                  <li>
                    <FormattedMessage id="plugins.numberRange.status" />:{" "}
                    {region.active ? (
                      <FormattedMessage id="plugins.numberRange.active" />
                    ) : (
                      <FormattedMessage id="plugins.numberRange.inactive" />
                    )}
                  </li>
                  <li>
                    <FormattedMessage
                      id="plugins.numberRange.range"
                      defaultMessage="Range"
                    />: <FormattedNumber value={region.start} />{" "}
                    <FormattedMessage id="plugins.numberRange.to" />{" "}
                    <FormattedNumber value={region.end} />
                  </li>
                  <li>
                    <FormattedMessage id="plugins.numberRange.state" />:{" "}
                    <FormattedNumber value={region.state} />
                  </li>
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
  {loadRegions, setAllocation}
)(_RegionDetail);
