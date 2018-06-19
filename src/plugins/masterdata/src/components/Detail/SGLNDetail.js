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
import {Card, Callout} from "@blueprintjs/core";
import {connect} from "react-redux";
import {loadLocationDetail} from "../../reducers/masterdata";
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage} from "react-intl";
import objectPath from "object-path";

class _SGLNDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {locationDetail: {}};
  }
  componentDidMount() {
    this.setState({locationDetail: {}});
    this.props.loadLocationDetail(
      this.props.server,
      this.props.match.params.locationIdentifier
    );
  }
  componentWillReceiveProps(nextProps) {
    this.setState({locationDetail: nextProps.locationDetail});
  }
  render() {
    return (
      <RightPanel
        title={<FormattedMessage id="plugins.masterData.locationDetail" />}>
        {JSON.stringify(this.state.locationDetail)}
        <Card>
          <h5>{this.state.locationDetail.identifier}</h5>
          {this.state.locationDetail.detail ? null : (
            <Callout>
              {JSON.stringify(
                objectPath.get(this.state, "locationDetail.error.response.body")
              )}
            </Callout>
          )}
        </Card>
      </RightPanel>
    );
  }
}

export const SGLNDetail = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      locationDetail: objectPath.get(
        state,
        `masterdata.servers.${ownProps.match.params.serverID}.locationDetail`,
        {}
      )
    };
  },
  {loadLocationDetail}
)(_SGLNDetail);
