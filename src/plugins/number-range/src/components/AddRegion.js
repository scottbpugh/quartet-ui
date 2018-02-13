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
import {Card} from "@blueprintjs/core";
import NRTree from "./NRTree";
import RegionForm from "./RegionForm";
import {FormattedMessage} from "react-intl";

class _AddRegion extends Component {
  constructor(props) {
    super(props);
    this.currentServer = this.props.nr[this.props.match.params.serverID];
    for (let pool of this.currentServer.pools) {
      // match pool.
      if (pool.machine_name === this.props.match.params.pool) {
        this.currentPool = pool;
      }
    }
  }
  componentDidMount() {}

  render() {
    return (
      <Panels title={<FormattedMessage id="plugins.numberRange.addRegion" />}>
        <LeftPanel>
          <NRTree nr={this.props.nr} />
        </LeftPanel>
        <RightPanel>
          <div className="large-cards-container">
            <Card className="pt-elevation-4 form-card">
              <h5>
                <FormattedMessage id="plugins.numberRange.addRegion" />
              </h5>
              <RegionForm
                server={this.currentServer.server}
                pool={this.currentPool}
                history={this.props.history}
              />
            </Card>
          </div>
        </RightPanel>
      </Panels>
    );
  }
}

export const AddRegion = connect((state, ownProps) => {
  return {
    servers: state.serversettings.servers,
    nr: state.numberrange.servers
  };
}, {})(_AddRegion);
