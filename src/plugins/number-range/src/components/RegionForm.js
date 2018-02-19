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
import {Field, reduxForm, change} from "redux-form";
import {getRegionFormStructure} from "../lib/serialbox-api";
import {FormGroup, Intent} from "@blueprintjs/core";
import classNames from "classnames";
import {postAddRegion} from "../lib/serialbox-api";
import {SubmissionError} from "redux-form";
import {showMessage} from "lib/message";
import {required, maxLength, minValue, maxValue} from "lib/forms/validators";

// see https://redux-form.com/7.2.0/examples/initializefromstate/ to improve this.
const defaultField = ({
  input,
  fieldData,
  type,
  meta: {touched, error, warning}
}) => {
  let intent = "";
  let intentClass = "";
  if (touched && error) {
    intent = Intent.DANGER;
    intentClass = "pt-intent-danger";
  }
  let inputField = "";
  if (fieldData.description.type === "boolean") {
    inputField = (
      <label className="pt-control pt-switch">
        <input
          {...input}
          type="checkbox"
          name={fieldData.name}
          className={intent}
          intent={intent}
        />
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
        width={300}
        className={classNames({"pt-input": true, [intentClass]: true})}
        required={fieldData.description.required}
      />
    );
  }

  let helperInstruction = fieldData.description.help_text || "";
  let helperText = error ? `${error} ${helperInstruction}` : helperInstruction;

  return (
    <FormGroup
      helperText={helperText}
      label={fieldData.description.label}
      required={fieldData.description.required}
      intent={intent}>
      {inputField}
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
              // create sync validation arrays.
              fieldObj.validate = this.getSyncValidators(fieldObj);
              return true;
            }
            return false;
          });
        this.setState(
          {
            formStructure: formStructure
          },
          () => {
            // After state has been rendered,
            // initialize checkboxes as false by default to prevent them
            // from being missing in post.
            // Same technique might be needed to set initial values
            // asynchronously in the future.
            for (let field of Object.keys(postFields)) {
              if (postFields[field].type === "boolean") {
                props.dispatch(change("addRegion", field, false));
              }
            }
          }
        );
      });
    }
  }
  getSyncValidators(field) {
    let validate = []; // Dynamically build this.
    //validate.push(required);
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
  // Handles the RegionForm post.
  submit = postValues => {
    return postAddRegion(this.props.server, postValues)
      .then(resp => {
        return Promise.all([resp, resp.json()]);
      })
      .then(proms => {
        // we handle the success here.
        if (proms[0].ok) {
          if (proms[0].status === 201) {
            showMessage({
              msg: "New region created successfully",
              type: "success"
            });
            this.props.history.push("/number-range/pools");
          }
          return proms[1];
        } else {
          // We handle the error info in JSON here.
          if (proms[1].detail) {
            // toaster here.
            showMessage({msg: proms[1].detail, type: "error"});
          }
          throw new SubmissionError(proms[1]);
        }
      });
  };
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
        //field.name = field.name.replace(/_/g, "");
        return (
          <Field
            key={field.name}
            name={field.name}
            fieldData={field}
            component={defaultField}
            type={type}
            className="pt-input"
            width={300}
            validate={field.validate}
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
      <form onSubmit={handleSubmit(this.submit)}>
        {form}
        <button
          className="pt-button pt-intent-primary"
          type="submit"
          disabled={this.props.submitting}>
          Submit
        </button>
      </form>
    );
  }
}

let RegionForm = reduxForm({
  form: "addRegion"
})(_RegionForm);

export default RegionForm;
