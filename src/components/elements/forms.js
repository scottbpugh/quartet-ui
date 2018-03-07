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
import React from "react";
import {required, maxLength, minValue, maxValue} from "lib/forms/validators";
import {FormGroup, Intent} from "@blueprintjs/core";
import classNames from "classnames";

// see https://redux-form.com/7.2.0/examples/initializefromstate/ to improve this.

/**
 * DefaultField - Creates a BluePrint FormGroup with a field
 * tied to ReduxForm.
 * To be used as follows:
 *           <Field
 *             key={field.name}
 *             name={field.name}
 *              fieldData={field}
 *              component={DefaultField}
 *              type={type}
 *              className="pt-input"
 *              width={300}
 *              validate={field.validate}
 *            />
 *
 * fieldData is expected to be an Object as follows:
 * {name: fieldName, description: postData[field]} (postData from Django Options.)
 * Here is an example of what is returned from Django OPTIONS for the description:
 * {"name":"active","description":{"type":"boolean","required":false,"read_only":false,"label":"Active","help_text":"Whether or not this pool is active/in-use. If marked false the pool will no longer be able to be used in API calls, etc."}}
 *
 *
 * @return {React Element} FormGroup.
 */
export const DefaultField = ({
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
  if (
    fieldData.description.type === "field" ||
    fieldData.description.type === "hidden"
  ) {
    inputField = (
      <div style={{display: "none"}}>
        <label className="pt-control pt-switch">
          <input
            {...input}
            type="hidden"
            name={fieldData.name}
            className={intent}
            intent={intent}
          />
          <span className="pt-control-indicator" />
          {fieldData.description.label}
        </label>
      </div>
    );
  } else if (fieldData.description.type === "boolean") {
    inputField = (
      <label className="pt-control pt-switch">
        <input
          {...input}
          type="checkbox"
          name={fieldData.name}
          defaultChecked={fieldData.defaultValue}
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
  let helperText = error
    ? `${error} - ${helperInstruction}`
    : helperInstruction;
  const shouldHide =
    fieldData.description.type === "field" ||
    fieldData.description.type === "hidden";
  const style = {};
  style.display = shouldHide ? "none" : "block";
  return (
    <div style={style}>
      <FormGroup
        helperText={helperText}
        label={fieldData.description.label}
        required={fieldData.description.required}
        intent={intent}>
        {inputField}
      </FormGroup>
    </div>
  );
};

/**
 * getSyncValidators - Description
 *
 * @param {object} Same as fieldData object in DefaultField.
 * {name: fieldName, description: postData[field]} (postData from Django Options.)
 * @return {array} Array of validators.
 */
export const getSyncValidators = field => {
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
    Number(field.description.min_value) > -999999
  ) {
    validate.push(minValue(Number(field.description.min_value)));
  }
  if (
    field.description.max_value &&
    Number(field.description.max_value) < 999999
  ) {
    validate.push(maxValue(Number(field.description.max_value)));
  }
  return validate;
};
