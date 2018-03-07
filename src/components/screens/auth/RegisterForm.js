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
import {getRegistrationFormStructure} from "lib/auth-api";
import {DefaultField, getSyncValidators} from "components/elements/forms";
import {Field, reduxForm, change} from "redux-form";

class _RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {formStructure: []};
    this.formStructureRetrieved = false;
  }
  componentDidMount() {
    this.constructForm(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.constructForm(nextProps);
  }
  constructForm(props) {
    if (props.isOpen && !this.formStructureRetrieved) {
      getRegistrationFormStructure(props.server).then(data => {
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
              fieldObj.validate = getSyncValidators(fieldObj);
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
  render() {
    const {handleSubmit} = this.props;
    let form = this.state.formStructure
      .map(field => {
        let type = "text";
        if (field.name === "pool") {
          // we'll populate dynamically based on path.
          field.description.required = false;
          field.validate = [];
        }
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
            component={DefaultField}
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
      <form onSubmit={this.submit}>
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

export const RegisterForm = reduxForm({
  form: "registerForm"
})(_RegisterForm);
