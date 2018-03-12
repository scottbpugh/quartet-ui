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
  AnchorButton
} from "@blueprintjs/core";
import RegionRange from "./RegionRange";
import classNames from "classnames";
import {FormattedDate, FormattedMessage, FormattedNumber} from "react-intl";
import {RegionForm} from "./RegionForm";
import {RandomizedRegionForm} from "./RandomizedRegionForm";

export class RegionCard extends Component {
  constructor(props) {
    super(props);
    this.state = {hovered: false};
    this.regionType = this.props.region.state ? "serial" : "randomized";
  }
  mouseIn = evt => {
    this.setState({hovered: true});
  };
  mouseOut = evt => {
    this.setState({hovered: false});
  };
  goToEdit = evt => {
    let formPath =
      this.regionType == "serial" ? "add-region" : "add-randomized-region";
    this.props.history.push({
      pathname: `/number-range/${formPath}/${this.props.serverID}/${
        this.props.pool.machine_name
      }`,
      state: {defaultValues: this.props.region, editRegion: true}
    });
  };
  trashRegion = evt => {};
  render() {
    const {region, lastUpdated, alloc} = this.props;
    return (
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
              {this.regionType == "serial" ? (
                <FormattedMessage id="plugins.numberRange.serial" />
              ) : (
                <FormattedMessage id="plugins.numberRange.randomized" />
              )}
            </Tag>
            {region.readable_name}{" "}
            {this.state.hovered ? (
              <ButtonGroup className="card-control" minimal={true} small={true}>
                <Button small={true} iconName="edit" onClick={this.goToEdit} />
                <Button
                  small={true}
                  iconName="trash"
                  onClick={this.trashRegion}
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
    );
  }
}
