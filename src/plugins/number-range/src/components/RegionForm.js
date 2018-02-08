// Copyright (c) 2018 Serial Lab
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
import {Field, reduxForm} from "redux-form";
import {getRegionFormStructure} from "../lib/serialbox-api";
import {FormGroup} from "@blueprintjs/core";

const required = value => (value ? undefined : "Required");
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;

const number = value =>
  value && isNaN(Number(value)) ? "Must be a number" : undefined;
const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined;
const maxValue = max => value =>
  value && value > max ? `Must be less or equal to ${max}` : undefined;
/*
class Switcher extends Component {
  constructor(props) {
    super(props);
    this.state = {isChecked: props.isChecked};
  }
  handleCheck = evt => {
    console.log(evt);
  };
  render() {
    return (
      <Switch defaultChecked={this.state.isChecked} label={this.props.label} />
    );
  }
}*/

const defaultField = ({
  input,
  fieldData,
  type,
  meta: {touched, error, warning}
}) => {
  let inputField = "";
  if (fieldData.description.type === "boolean") {
    inputField = (
      <label className="pt-control pt-switch">
        <input {...input} type="checkbox" name={fieldData.name} />
        <span className="pt-control-indicator" />
        {fieldData.description.label}
      </label>
    );
  } else {
    inputField = (
      <input
        {...input}
        name={fieldData.name}
        type={type}
        className="pt-input"
        width={300}
      />
    );
  }
  return (
    <FormGroup
      helperText={fieldData.description.help_text}
      label={fieldData.description.label}
      required={fieldData.description.required}>
      {inputField}
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </FormGroup>
  );
};

class _RegionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {formStructure: []};
  }
  componentDidMount() {
    this.constructForm(this.props);
  }
  componentWillReceiveProps(nextProps) {
    // quick check to ensure we have a valid server.
    this.constructForm(nextProps);
  }
  constructForm(props) {
    // is only triggered once when the form isn't populated.
    if (
      this.state.formStructure.length === 0 &&
      props.server &&
      props.server.serverSettingName
    ) {
      getRegionFormStructure(props.server).then(data => {
        // parse the values and filter to the one that are not readonly.
        let postFields = data.actions.POST;
        let formStructure = Object.keys(postFields)
          .map(field => {
            if (postFields[field].read_only === false) {
              return {name: field, description: postFields[field]};
            } else {
              return null;
            }
          })
          .filter(fieldObj => {
            if (fieldObj) {
              return true;
            }
            return false;
          });
        this.setState({
          formStructure: formStructure
        });
      });
    }
  }
  getValidators(field) {
    console.log(field);
    let validate = []; // Dynamically build this.
    if (field.description.required === true) {
      validate.push(required);
    }
    if (field.description.max_length) {
      validate.push(maxLength(Number(field.description.max_length)));
    }
    if (
      field.description.min_value &&
      Number(field.description.min_value) > -10000
    ) {
      validate.push(minValue(Number(field.description.min_value)));
    }
    if (
      field.description.max_value &&
      Number(field.description.max_value) < 10000
    ) {
      validate.push(maxValue(Number(field.description.max_value)));
    }
    return validate;
  }
  render() {
    const {handleSubmit} = this.props;
    let form = this.state.formStructure
      .map(field => {
        let type = "text";
        if (field.description.type === "integer") {
          type = "number";
        } else if (field.description.type === "boolean") {
          type = "checkbox";
        }
        return (
          <Field
            key={field.description.name}
            name={field.name}
            fieldData={field}
            component={defaultField}
            type={type}
            key={field.description.name}
            className="pt-input"
            width={300}
            validate={this.getValidators(field)}
          />
        );
      })
      .filter(field => {
        if (field) {
          return field;
        }
        return false;
      });

    return (
      <form onSubmit={handleSubmit}>
        {form}
        <button type="submit">Submit</button>
      </form>
    );
  }
}

let RegionForm = reduxForm({
  form: "addRegion"
})(_RegionForm);

export default RegionForm;
