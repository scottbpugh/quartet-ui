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
import {getFormInfo} from "lib/auth-api";
import {DefaultField, getSyncValidators} from "components/elements/forms";
import {Field, reduxForm, SubmissionError} from "redux-form";
import {Callout, Intent} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";

class _RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: [],
      success: false,
      successMessage: null,
      username: null
    };
    this.formStructureRetrieved = false;
  }
  componentDidMount() {
    this.constructForm(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.constructForm(nextProps);
  }
  submit = postValues => {
    const {server} = this.props;
    var that = this;
    return server.getClient().then(client => {
      return client
        .execute({
          operationId: "rest_auth_registration_create",
          parameters: {
            data: postValues
          }
        })
        .then(result => {
          that.setState({
            success: true,
            successMessage: result.body.detail,
            username: postValues.username
          });
        })
        .catch(error => {
          if (error.status === 400 && error.response && error.response.body) {
            if ("non_field_errors" in error.response.body) {
              // a form-wide error is present.
              throw new SubmissionError({
                ...error.response.body,
                _error: error.response.body.non_field_errors
              });
            }
            // we have an object with validation errors.
            throw new SubmissionError(error.response.body);
          }
        });
    });
  };
  constructForm(props) {
    if (props.isOpen && !this.formStructureRetrieved) {
      let createForm = formStructure => {
        this.setState({
          formStructure: formStructure
        });
        this.formStructureRetrieved = true;
      };
      getFormInfo(props.server, "rest-auth/registration/", createForm);
    }
  }

  render() {
    const {error, handleSubmit, submitting} = this.props;
    const {success, successMessage} = this.state;
    let form = this.state.formStructure
      .map(field => {
        let type = "text";
        if (field.description.type === "integer") {
          type = "number";
        } else if (field.description.type === "boolean") {
          type = "checkbox";
        } else if (
          field.description.type === "password" ||
          field.name.includes("password")
        ) {
          type = "password";
        }
        //field.name = field.name.replace(/_/g, "");
        return (
          <Field
            key={field.name}
            name={field.name}
            fieldData={field}
            type={type}
            component={DefaultField}
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
      <div>
        {success ? (
          <Callout iconName="pt-icon-saved" intent={Intent.SUCCESS}>
            <FormattedMessage
              id="app.servers.userCreated"
              values={{username: this.state.username}}
            />
            {successMessage}
          </Callout>
        ) : (
          <form onSubmit={handleSubmit(this.submit.bind(this))}>
            {form}

            <button
              className="pt-button pt-intent-primary"
              type="submit"
              disabled={submitting}>
              Submit
            </button>
            {error ? (
              <Callout iconName="warning" intent={Intent.DANGER}>
                {error}
              </Callout>
            ) : null}
          </form>
        )}
      </div>
    );
  }
}

export const RegisterForm = reduxForm({
  form: "registerForm"
})(_RegisterForm);
