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
import {withRouter} from "react-router-dom";
import {Card} from "@blueprintjs/core";
import NRTree from "./NRTree";
import PoolForm from "./PoolForm";
import {FormattedMessage, FormattedDate, FormattedNumber} from "react-intl";

class _AddPool extends Component {
  constructor(props) {
    super(props);
    this.currentServer = this.props.nr[this.props.match.params.serverID];
  }
  componentDidMount() {}
  render() {
    return (
      <Panels title={<FormattedMessage id="plugins.numberRange.addPool" />}>
        <LeftPanel>
          <NRTree nr={this.props.nr} />
        </LeftPanel>
        <RightPanel>
          <Card>
            <h5>
              <FormattedMessage id="plugins.numberRange.addPool" />
            </h5>
            <PoolForm server={this.currentServer.server} />
          </Card>
        </RightPanel>
      </Panels>
    );
  }
}

export const AddPool = connect((state, ownProps) => {
  return {
    servers: state.serversettings.servers,
    nr: state.numberrange.servers
  };
}, {})(_AddPool);
