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

import "../style.css";
import RegionRange from "./RegionRange";
import {deleteARegion} from "../reducers/numberrange";
const React = qu4rtet.require("react");
const {Component} = React;
const {connect} = qu4rtet.require("react-redux");
const {Field, reduxForm, SubmissionError, change} = qu4rtet.require(
  "redux-form"
);
const {showMessage} = qu4rtet.require("./lib/message");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const {Card, Tag, Intent, Button, ButtonGroup} = qu4rtet.require(
  "@blueprintjs/core"
);
const {FormattedMessage, FormattedDate, FormattedNumber} = qu4rtet.require(
  "react-intl"
);
const classNames = qu4rtet.require("classnames");
const {DeleteDialog} = qu4rtet.require("./components/elements/DeleteDialog");

export class _RegionCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      showConfirmDialog: false,
      region: props.region
    };
  }
  componentDidMount() {
    //this.state = {hovered: false, dialogOpened: false};
    this.regionType = this.getRegionType(this.props.region);
    this.setState({region: this.props.region});
  }
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.region) !== JSON.stringify(this.props.region)
    ) {
      this.regionType = this.getRegionType(nextProps.region);
      this.setState({region: nextProps.region});
    }
  }
  mouseIn = evt => {
    this.setState({hovered: true});
  };
  mouseOut = evt => {
    this.setState({hovered: false});
  };
  getRegionType = region => {
    if (region.state) {
      return "serial";
    }
    if (!region.state && region.max) {
      return "randomized";
    }
    if (region.processing_class_path !== undefined) {
      return "list-based";
    }
    return null;
  };
  goToEdit = evt => {
    let {region} = this.state;
    let formPath = null;
    if (this.regionType === "serial") {
      formPath = "edit-region";
    } else if (this.regionType === "randomized") {
      formPath = "edit-randomized-region";
    } else if (this.regionType === "list-based") {
      formPath = "edit-list-based-region";
    }
    this.props.history.push({
      pathname: `/number-range/${formPath}/${this.props.serverID}/${
        this.props.pool.machine_name
      }`,
      state: {defaultValues: this.state.region, editRegion: true}
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
    const {lastUpdated, alloc} = this.props;
    const {region} = this.state;
    // default serial.
    let regionTitle = <FormattedMessage id="plugins.numberRange.serial" />;
    if (this.regionType === "randomized") {
      regionTitle = <FormattedMessage id="plugins.numberRange.randomized" />;
    } else if (this.regionType === "list-based") {
      regionTitle = <FormattedMessage id="plugins.numberRange.listBased" />;
    }
    return (
      <div>
        <Card
          className={classNames({
            "bp3-elevation-1": true,
            "region-detail": true,
            updated: lastUpdated === region.machine_name
          })}
          key={region.machine_name}>
          <div onMouseEnter={this.mouseIn} onMouseLeave={this.mouseOut}>
            <h5 className="bp3-heading">
              <Tag className="tag-header" intent={Intent.PRIMARY}>
                {regionTitle}
              </Tag>
              {region.readable_name}{" "}
              {this.state.hovered ? (
                <ButtonGroup
                  className="card-control"
                  minimal={true}
                  small={true}>
                  <Button
                    small={true}
                    icon="edit"
                    onClick={this.goToEdit}
                  />
                  <Button
                    small={true}
                    icon="trash"
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
              {region.end || region.max ? (
                <li>
                  <FormattedMessage
                    id="plugins.numberRange.range"
                    defaultMessage="Range"
                  />: <FormattedNumber value={region.min || region.start} />{" "}
                  <FormattedMessage id="plugins.numberRange.to" />{" "}
                  <FormattedNumber value={region.end || region.max} />
                </li>
              ) : null}
              <li>
                {region.state ? (
                  <FormattedMessage id="plugins.numberRange.state" />
                ) : (
                  <FormattedMessage id="plugins.numberRange.current" />
                )}:{" "}
                <FormattedNumber
                  value={
                    region.state || region.current || region.last_number_line
                  }
                />
              </li>
              {this.regionType === "list-based" ? (
                <li>
                  <FormattedMessage id="plugins.numberRange.processingClass" />
                  <pre style={{overflowY: "hidden", whiteSpace: "pre-wrap"}}>
                    {region.processing_class_path}
                  </pre>
                </li>
              ) : null}
            </ul>
            {["serial", "randomized"].includes(this.regionType) ? (
              <RegionRange
                start={region.min || region.start}
                end={region.end || region.max}
                state={region.state}
                remaining={region.remaining}
                alloc={alloc}
              />
            ) : null}
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
