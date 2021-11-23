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
import {pluginRegistry} from "plugins/pluginRegistration";
import {SingleCardPicker} from "components/elements/SingleCardPicker";
import {Dialog, Button, Tag} from "@blueprintjs/core";
import classNames from "classnames";

const LocationTypeEntry = props => {
  const updateFieldVal = entry => {
    // trigger a redux form field value change
    props.changeValue(entry);
  };
  return (
    <div key={props.entry.id} onClick={updateFieldVal.bind(this, props.entry)}>
      <h5>
        {props.entry.identifier}
      </h5>
      <ul className="picker-data-list">
        <li>
          {props.entry.identifier}
        </li>
        {props.entry.description ? (
          <li>
            {props.entry.description}
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export class LocationTypeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationType: null,
      edited: false // to preserve overridden company if changed from the form.
    };
  }

  componentDidMount() {
    this.setLocationType(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setLocationType(nextProps);
  }

  setLocationType(props) {
    if (
      this.state.edited === false
      && props.existingValues
      && props.existingValues.location_type
    ) {
      pluginRegistry
        .getServer(props.server)
        .fetchObject("masterdata_location_types_read", {
          id: props.existingValues.location_type
        })
        .then(item => {
          this.setState({locationType: item.identifier});
        });
    }
  }

  changeValue(entry) {
    this.setState({locationType: entry.identifier, edited: true}, () => {
      this.props.changeFieldValue("locationForm", "location_type", entry.id);
      this.props.toggleLocationTypeDialog();
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.locationType ? (
            <Tag
              style={{cursor: "pointer"}}
              className="pt-intent-primary"
              onClick={this.props.toggleLocationTypeDialog}
            >
              {this.state.locationType}
            </Tag>
          ) : (
            <Button
              onClick={this.props.toggleLocationTypeDialog}
              text="Select a Location Type"
            />
          )}
        </div>
        <Dialog
          iconName="inbox"
          isOpen={this.props.isLocationTypeOpen}
          onClose={this.props.toggleLocationTypeDialog}
          style={{width: "80%"}}
          className={classNames({
            "pt-dark": this.props.theme.includes("dark"),
            "wide-dialog": true
          })}
          title="Select a Location Type"
        >
          <div className="pt-dialog-body">
            <SingleCardPicker
              {...this.props}
              changeValue={this.changeValue.bind(this)}
              loadEntries={this.props.loadLocationTypes}
              entries={this.props.locationTypes}
              entryStyle={{height: "150px !important"}}
              entryClass={LocationTypeEntry}
            />
          </div>
          <div className="pt-dialog-footer" />
        </Dialog>
      </div>
    );
  }
}
