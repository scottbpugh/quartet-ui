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
import "./server-settings.css";
import {Button} from "@blueprintjs/core";
import {connect} from "react-redux";
import {saveServer} from "../../../reducers/serversettings";
import {DefaultField, getSyncValidators} from "components/elements/forms";
import {Field, reduxForm} from "redux-form";

const FORM_NAME = "serverForm";

// this form consumes data in instance of class lib/servers/Server.

/**
 * ServerForm - Description
 *
 * @param {Object} formData        structure representing input.
 * @param {function} saveHandler   callback to save the form
 * @param {function} updateHandler callback to update/validate each input
 *
 * @return {ReactElement} A form element with a series of inputs based on formData.
 */
class _ServerForm extends Component {
  componentDidMount() {
    if (this.props.defaultValues) {
      this.props.initialize(this.props.defaultValues);
    }
  }
  submit = postValues => {
    this.props.saveServer(postValues);
    if (this.props.submitCallback) {
      // defer to parent to do whatever it needs post saved.
      this.props.submitCallback(postValues);
    }
  };
  validateServerName = value => {
    let serverSettingNames = Object.keys(this.props.servers).map(server => {
      return this.props.servers[server].serverSettingName.toLowerCase().trim();
    });
    if (value && serverSettingNames.includes(value.toLowerCase().trim())) {
      return "Server Setting Name already used.";
    }
    return undefined;
  };
  render() {
    this.formElems = this.props.formData.map(field => {
      field.validate = getSyncValidators(field);
      if (field.name === "serverSettingName") {
        field.validate.push(this.validateServerName.bind(this));
      }
      return (
        <Field
          key={field.name}
          name={field.name}
          fieldData={field}
          component={DefaultField}
          type={field.description.type}
          className="pt-input"
          width={300}
          validate={field.validate}
        />
      );
    });
    const {handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit(this.submit)}>
        {this.formElems}
        <Button
          type="submit"
          className="pt-button pt-intent-primary"
          iconName="add">
          {this.props.saveButtonMsg}
        </Button>
      </form>
    );
  }
}

export const ServerForm = connect(
  state => ({
    servers: state.serversettings.servers
  }),
  {saveServer}
)(reduxForm({form: FORM_NAME})(_ServerForm));
