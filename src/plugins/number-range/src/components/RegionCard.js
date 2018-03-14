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
import {
  Card,
  Callout,
  Tag,
  Intent,
  Button,
  ButtonGroup,
  AnchorButton,
  Dialog,
  Position
} from "@blueprintjs/core";
import RegionRange from "./RegionRange";
import classNames from "classnames";
import {FormattedDate, FormattedMessage, FormattedNumber} from "react-intl";
import {RegionForm} from "./RegionForm";
import {RandomizedRegionForm} from "./RandomizedRegionForm";
import {deleteARegion} from "../reducers/numberrange";
import {connect} from "react-redux";
import {DeleteDialog} from "components/elements/DeleteDialog";

export class _RegionCard extends Component {
  constructor(props) {
    super(props);
    this.state = {hovered: false, showConfirmDialog: false};
  }
  componentDidMount() {
    //this.state = {hovered: false, dialogOpened: false};
  }
  mouseIn = evt => {
    this.setState({hovered: true});
  };
  mouseOut = evt => {
    this.setState({hovered: false});
  };
  goToEdit = evt => {
    let {region} = this.props;
    let formPath =
      region && region.state ? "add-region" : "add-randomized-region";
    this.props.history.push({
      pathname: `/number-range/${formPath}/${this.props.serverID}/${
        this.props.pool.machine_name
      }`,
      state: {defaultValues: this.props.region, editRegion: true}
    });
  };

  toggleDialog = evt => {
    this.setState({showConfirmDialog: !this.state.showConfirmDialog});
  };

  trashRegion = evt => {
    const {deleteARegion, serverObject, pool, region} = this.props;
    this.toggleDialog();
    deleteARegion(serverObject, pool, region);
  };

  render() {
    const {region, lastUpdated, alloc, theme} = this.props;
    let regionType = region.state ? "serial" : "randomized";
    return (
      <div>
        <Card
          className={classNames({
            "pt-elevation-4": true,
            "region-detail": true,
            updated: lastUpdated === region.machine_name
          })}
          key={region.machine_name}>
          <div onMouseEnter={this.mouseIn} onMouseLeave={this.mouseOut}>
            <h5>
              <Tag className="tag-header" intent={Intent.PRIMARY}>
                {regionType == "serial" ? (
                  <FormattedMessage id="plugins.numberRange.serial" />
                ) : (
                  <FormattedMessage id="plugins.numberRange.randomized" />
                )}
              </Tag>
              {region.readable_name}{" "}
              {this.state.hovered ? (
                <ButtonGroup
                  className="card-control"
                  minimal={true}
                  small={true}>
                  <Button
                    small={true}
                    iconName="edit"
                    onClick={this.goToEdit}
                  />
                  <Button
                    small={true}
                    iconName="trash"
                    onClick={this.toggleDialog}
                  />
                </ButtonGroup>
              ) : null}
            </h5>

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
                />: <FormattedNumber value={region.min || region.start} />{" "}
                <FormattedMessage id="plugins.numberRange.to" />{" "}
                <FormattedNumber value={region.end || region.max} />
              </li>
              <li>
                {region.state ? (
                  <FormattedMessage id="plugins.numberRange.state" />
                ) : (
                  <FormattedMessage id="plugins.numberRange.current" />
                )}: <FormattedNumber value={region.state || region.current} />
              </li>
            </ul>
            <RegionRange
              start={region.min || region.start}
              end={region.end || region.max}
              state={region.state}
              remaining={region.remaining}
              alloc={alloc}
            />
          </div>
        </Card>
        <DeleteDialog
          isOpen={this.state.showConfirmDialog}
          toggle={this.toggleDialog.bind(this)}
          title={
            <FormattedMessage
              id="plugins.numberRange.deleteRegion"
              values={{regionName: region.readable_name}}
            />
          }
          body={
            <FormattedMessage id="plugins.numberRange.deleteRegionConfirm" />
          }
          deleteAction={this.trashRegion.bind(this)}
        />
      </div>
    );
  }
}

export const RegionCard = connect(
  (state, ownProps) => {
    return {};
  },
  {deleteARegion}
)(_RegionCard);
