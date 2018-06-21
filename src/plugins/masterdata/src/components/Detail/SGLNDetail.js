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
import {Card, Callout, Button} from "@blueprintjs/core";
import {connect} from "react-redux";
import {loadLocationDetail} from "../../reducers/masterdata";
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage} from "react-intl";
import objectPath from "object-path";
import {SingleMarkerMap} from "components/elements/SingleMarkerMap";

const yieldDataPairRowIfSet = (key, value) => {
  if (key && value) {
    return (
      <tr>
        <td>{key}</td>
        <td>{value}</td>
      </tr>
    );
  }
  return null;
};

class _SGLNDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {locationDetail: {}};
  }
  goToEdit = () => {
    this.props.history.push({
      pathname: `/masterdata/edit-location/${
        this.props.server.serverID
      }/location/${this.state.locationDetail.detail.id}`,
      state: {defaultValues: this.state.locationDetail.detail, edit: true}
    });
  };
  componentDidMount() {
    this.setState({locationDetail: {}});
    this.props.loadLocationDetail(
      this.props.server,
      this.props.match.params.locationIdentifier
    );
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.match.params.locationIdentifier !==
      this.props.match.params.locationIdentifier
    ) {
      this.props.loadLocationDetail(
        this.props.server,
        this.props.match.params.locationIdentifier
      );
    }
    this.setState({locationDetail: nextProps.locationDetail});
  }
  splitAndCap(value) {
    return value.replace(/_/g, " ");
  }
  render() {
    let detail = this.state.locationDetail.detail;
    return (
      <RightPanel
        title={<FormattedMessage id="plugins.masterData.locationDetail" />}>
        <div className="cards-container">
          {!detail ? (
            <Callout>
              {JSON.stringify(
                objectPath.get(this.state, "locationDetail.error.response.body")
              )}
            </Callout>
          ) : null}

          {detail ? (
            <Card className="pt-elevation-2">
              <h5>
                {detail.SGLN}{" "}
                <Button
                  onClick={this.goToEdit}
                  className="pt-button pt-icon-edit pt-intent-primary add-incard-button">
                  Edit
                </Button>
              </h5>
              <table className="pt-table data-pair-table pt-bordered pt-striped">
                <tbody>
                  {yieldDataPairRowIfSet("ID", detail.id)}
                  {yieldDataPairRowIfSet("GLN13", detail.GLN13)}
                  {yieldDataPairRowIfSet("SGLN", detail.SGLN)}
                  {yieldDataPairRowIfSet("Name", detail.name)}
                </tbody>
              </table>
            </Card>
          ) : null}
          {detail ? (
            <Card className="pt-elevation-2">
              <h5>Location Information</h5>
              {detail && detail.longitude && detail.latitude ? (
                <SingleMarkerMap
                  targetId={detail.SGLN}
                  delay={0}
                  size={{width: "auto", height: "auto"}}
                  minZoom={1}
                  maxZoom={16}
                  zoom={1}
                  markerLocation={[
                    Number(detail.longitude),
                    Number(detail.latitude)
                  ]}
                />
              ) : null}
              <table className="pt-table data-pair-table  pt-bordered pt-striped">
                <tbody>
                  {yieldDataPairRowIfSet("Address", detail.address1)}
                  {yieldDataPairRowIfSet("Address 2", detail.address2)}
                  {yieldDataPairRowIfSet("Address 3", detail.address3)}
                  {yieldDataPairRowIfSet("City", detail.city)}
                  {yieldDataPairRowIfSet(
                    "State/Province",
                    detail.state_province
                  )}
                  {yieldDataPairRowIfSet("Postal Code", detail.postal_code)}
                  {yieldDataPairRowIfSet("Country", detail.country)}
                  {yieldDataPairRowIfSet("Latitude", detail.latitude)}
                  {yieldDataPairRowIfSet("Longitude", detail.longitude)}
                </tbody>
              </table>
            </Card>
          ) : null}

          {/*detail ? (
            <div className="data-pair-cards">
              {Object.keys(detail).map(key => {
                if (
                  (detail[key] && !Array.isArray(detail[key])) ||
                  (detail[key] &&
                    Array.isArray(detail[key]) &&
                    detail[key].length > 0)
                ) {
                  return (
                    <div className="data-pair-card">
                      <span className="key">{this.splitAndCap(key)}</span>
                      <span className="value">{detail[key]}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ) : null*/}
        </div>
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

