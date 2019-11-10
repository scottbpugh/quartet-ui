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
import {Card, Callout, Button, Tag} from "@blueprintjs/core";
import {connect} from "react-redux";
import {loadLocationDetail} from "../../reducers/masterdata";
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage} from "react-intl";
import objectPath from "object-path";
import {SingleMarkerMap} from "components/elements/SingleMarkerMap";
import {pluginRegistry} from "plugins/pluginRegistration";

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

const yieldKeyValPairs = (keyValArray, fieldNames = []) => {
  if (Array.isArray(keyValArray) && keyValArray.length > 0) {
    let arr = keyValArray.reduce(function(accumulator, keyValPair, index) {
      accumulator.push(
        <tr>{fieldNames.map(fieldName => <td>{keyValPair[fieldName]}</td>)}</tr>
      );
      return accumulator;
    }, []);
    return arr;
  }
  return null;
};

class _SGLNDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationDetail: {},
      companyName: null,
      siteName: null,
      locationTypeName: null
    };
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
    let currentCompany = objectPath.get(
      this.props,
      ["locationDetail", "detail", "company"],
      null
    );
    this.setRelatedFields(null, this.props);
  }

  setRelatedField(
    previousProps,
    currentProps,
    fieldName,
    operationId,
    stateFieldName,
    itemFieldName
  ) {
    let previousField = objectPath.get(
      previousProps,
      ["locationDetail", "detail", fieldName],
      null
    );
    let currentField = objectPath.get(
      currentProps,
      ["locationDetail", "detail", fieldName],
      null
    );
    if (currentField && previousField !== currentField) {
      let company = pluginRegistry
        .getServer(currentProps.server)
        .fetchObject(operationId, {
          id: currentField
        })
        .then(item => {
          this.setState({[stateFieldName]: item[itemFieldName]});
        })
        .catch(e => {
          // silence, already an error displayed with showMessage.
        });
    }
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
    this.setRelatedFields(this.props, nextProps);
    this.setState({locationDetail: nextProps.locationDetail});
  }
  setRelatedFields = (currentProps, nextProps) => {
    this.setRelatedField(
      currentProps,
      nextProps,
      "company",
      "masterdata_companies_read",
      "companyName",
      "name"
    );
    this.setRelatedField(
      currentProps,
      nextProps,
      "site",
      "masterdata_locations_read",
      "siteName",
      "name"
    );
    this.setRelatedField(
      currentProps,
      nextProps,
      "location_type",
      "masterdata_location_types_read",
      "locationTypeName",
      "identifier"
    );
  };
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
            <div
              className="twin-cards-container"
              style={{position: "relative"}}>
              <Card className="bp3-elevation-4">
                <h5 className="bp3-heading">
                  {detail.SGLN}{" "}
                  <Button
                    onClick={this.goToEdit}
                    className="bp3-button bp3-icon-edit bp3-intent-primary add-incard-button">
                    Edit
                  </Button>
                </h5>
                <table className="bp3-table data-pair-table bp3-bordered bp3-striped">
                  <tbody>
                    {yieldDataPairRowIfSet("GLN13", detail.GLN13)}
                    {yieldDataPairRowIfSet("SGLN", detail.SGLN)}
                    {yieldDataPairRowIfSet("Name", detail.name)}
                    <tr>
                      <td>Company</td>
                      <td>
                        <Tag className="bp3-intent-primary">
                          {this.state.companyName}
                        </Tag>
                      </td>
                    </tr>
                    <tr>
                      <td>Site</td>
                      <td>
                        <Tag className="bp3-intent-primary">
                          {this.state.siteName}
                        </Tag>
                      </td>
                    </tr>
                    <tr>
                      <td>Location Type</td>
                      <td>
                        <Tag className="bp3-intent-primary">
                          {this.state.locationTypeName}
                        </Tag>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card>
              {detail ? (
                <Card style={{position: "relative"}} className="bp3-elevation-4">
                  <h5 className="bp3-heading">
                    Additional Identifiers
                    <button
                      className="bp3-button bp3-intent-primary add-incard-button"
                      onClick={e => {
                        this.props.history.push({
                          pathname: `/masterdata/add-location-identifier/${
                            this.props.server.serverID
                          }`,
                          state: {
                            defaultValues: {
                              location: detail.id
                            }
                          }
                        });
                      }}>
                      <FormattedMessage id="plugins.masterData.addLocationIdentifier" />
                    </button>
                  </h5>
                  <table className="bp3-table data-pair-table bp3-bordered bp3-striped">
                    <tbody>
                      {yieldKeyValPairs(detail.locationidentifier_set, [
                        "identifier_type",
                        "identifier",
                        "description"
                      ])}
                    </tbody>
                  </table>
                </Card>
              ) : null}
            </div>
          ) : null}
          {detail ? (
            <Card className="bp3-elevation-4">
              <h5 className="bp3-heading">Geographic Information</h5>
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
              <table className="bp3-table data-pair-table  bp3-bordered bp3-striped">
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

          {detail ? (
            <Card className="bp3-elevation-4">
              <h5 className="bp3-heading">
                Location Fields{" "}
                <button
                  className="bp3-button bp3-intent-primary add-incard-button"
                  onClick={e => {
                    this.props.history.push({
                      pathname: `/masterdata/add-location-field/${
                        this.props.server.serverID
                      }`,
                      state: {
                        defaultValues: {
                          location: detail.id
                        }
                      }
                    });
                  }}>
                  <FormattedMessage id="plugins.masterData.addLocationField" />
                </button>
              </h5>
              <table className="bp3-table data-pair-table bp3-bordered bp3-striped">
                <tbody>
                  {yieldKeyValPairs(detail.locationfield_set, [
                    "name",
                    "value",
                    "description"
                  ])}
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
