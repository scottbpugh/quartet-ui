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

const CompanyTypeEntry = props => {
  const updateFieldVal = entry => {
    // trigger a redux form field value change
    props.changeValue(entry);
  };
  return (
    <div key={props.entry.id} onClick={updateFieldVal.bind(this, props.entry)}>
      <h5>{props.entry.identifier}</h5>
      <ul className="picker-data-list">
        <li>{props.entry.identifier}</li>
        {props.entry.description ? <li>{props.entry.description}</li> : null}
      </ul>
    </div>
  );
};

export class CompanyTypeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyType: null,
      edited: false // to preserve overridden company if changed from the form.
    };
  }

  componentDidMount() {
    this.setCompanyType(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setCompanyType(nextProps);
  }

  setCompanyType(props) {
    if (
      this.state.edited === false &&
      props.existingValues &&
      props.existingValues.company_type
    ) {
      pluginRegistry
        .getServer(props.server)
        .fetchObject("masterdata_company_types_read", {
          id: props.existingValues.company_type
        })
        .then(item => {
          this.setState({companyType: item.identifier});
        });
    }
  }

  changeValue(entry) {
    this.setState({companyType: entry.identifier, edited: true}, () => {
      this.props.changeFieldValue("CompanyForm", "company_type", entry.id);
      this.props.toggleCompanyTypeDialog();
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.companyType ? (
            <Tag
              style={{cursor: "pointer"}}
              className="bp3-intent-primary"
              onClick={this.props.toggleCompanyTypeDialog}>
              {this.state.companyType}
            </Tag>
          ) : (
            <Button
              onClick={this.props.toggleCompanyTypeDialog}
              text="Select a Company Type"
            />
          )}
        </div>
        <Dialog
          iconName="inbox"
          isOpen={this.props.isCompanyTypeOpen}
          onClose={this.props.toggleCompanyTypeDialog}
          style={{width: "80%"}}
          className={classNames({
            "bp3-dark": this.props.theme.includes("dark"),
            "wide-dialog": true
          })}
          title="Select a Company Type">
          <div className="bp3-dialog-body">
            <SingleCardPicker
              {...this.props}
              changeValue={this.changeValue.bind(this)}
              loadEntries={this.props.loadCompanyTypes}
              entries={this.props.companyTypes}
              entryStyle={{height: "150px !important"}}
              entryClass={CompanyTypeEntry}
            />
          </div>
          <div className="bp3-dialog-footer" />
        </Dialog>
      </div>
    );
  }
}
