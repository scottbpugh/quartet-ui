// Copyright (c) 2018 SerialLab
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
import {SingleMarkerMap} from "components/elements/SingleMarkerMap";
import classNames from "classnames";

const CompanyEntry = props => {
  const updateFieldVal = entry => {
    // trigger a redux form field value change
    props.changeValue(entry);
  };
  return (
    <div key={props.entry.id} onClick={updateFieldVal.bind(this, props.entry)}>
      <h5 className="bp3-heading">
        {props.entry.name}
      </h5>
      {props.entry.longitude && props.entry.latitude ? (
        <SingleMarkerMap
          size={{width: "260px"}}
          targetId={props.entry.GLN13}
          delay={Number(props.index) * 500}
          markerLocation={[
            Number(props.entry.longitude),
            Number(props.entry.latitude)
          ]}
        />
      ) : (
        <div style={{width: "260px", height: "130px", background: "#CCC"}} />
      )}

      <ul className="picker-data-list">
        <li>
          {props.entry.GLN13}
        </li>
        {props.entry.city ? (
          <li>
            {props.entry.city}
          </li>
        ) : null}
        {props.entry.country ? (
          <li>
            {props.entry.country}
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export class CompanyDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: null,
      edited: false // to preserve overridden company if changed from the form.
    };
  }

  componentDidMount() {
    this.setState({
      companyName: null,
      edited: false // to preserve overridden company if changed from the form.
    });
    this.setCompanyName(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setCompanyName(nextProps);
  }

  setCompanyName(props) {
    if (
      this.state.edited === false
      && props.existingValues
      && props.existingValues.company
    ) {
      pluginRegistry
        .getServer(props.server)
        .fetchObject("masterdata_companies_read", {
          id: props.existingValues.company
        })
        .then(item => {
          this.setState({companyName: item.name});
        });
    }
  }

  changeValue(entry) {
    this.setState({companyName: entry.name, edited: true}, () => {
      this.props.changeFieldValue(this.props.formName, "company", entry.id);
      this.props.toggleCompanyDialog();
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.companyName ? (
            <Tag
              style={{cursor: "pointer"}}
              className="bp3-intent-primary"
              onClick={this.props.toggleCompanyDialog}
            >
              {this.state.companyName}
            </Tag>
          ) : (
            <Button
              onClick={this.props.toggleCompanyDialog}
              text="Select Company"
            />
          )}
        </div>
        <Dialog
          iconName="inbox"
          isOpen={this.props.isCompanyOpen}
          onClose={this.props.toggleCompanyDialog}
          style={{width: "80%"}}
          className={classNames({
            "bp3-dark": this.props.theme.includes("dark"),
            "wide-dialog": true
          })}
          title="Select a Company"
        >
          <div className="bp3-dialog-body">
            <SingleCardPicker
              {...this.props}
              changeValue={this.changeValue.bind(this)}
              loadEntries={this.props.loadCompanies}
              entries={this.props.companies}
              entryClass={CompanyEntry}
            />
          </div>
          <div className="bp3-dialog-footer" />
        </Dialog>
      </div>
    );
  }
}
