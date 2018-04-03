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
import {showMessage} from "lib/message";
import {DefaultField} from "components/elements/forms";
import {Field, SubmissionError} from "redux-form";
import {FormattedMessage} from "react-intl";
import {getFormInfo} from "lib/auth-api";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Callout, Intent} from "@blueprintjs/core";

class _InlineForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: []
    };
    this.formObject = {}; // populated for updates.
    this.formStructureRetrieved = false;
  }
  componentDidMount() {
    this.constructForm(this.props);
  }
  submit = postValues => {
    let {
      server,
      edit,
      operationId,
      prepopulatedValues,
      objectName,
      redirectPath,
      parameters
    } = this.props;
    if (prepopulatedValues) {
      for (let field of prepopulatedValues) {
        // replaces/sets programmatically.
        postValues[field.name] = field.value;
      }
    }
    if (parameters) {
      parameters.data = postValues;
    } else {
      parameters = {data: postValues};
    }
    return server.getClient().then(client => {
      return client
        .execute({
          operationId: operationId,
          parameters: parameters
        })
        .then(result => {
          if (result.status === 201) {
            showMessage({
              msg: `New ${objectName} created successfully`,
              type: "success"
            });
          } else if (result.status === 200) {
            showMessage({
              msg: `Existing ${objectName} updated successfully`,
              type: "success"
            });
          }
          if (redirectPath) {
            this.props.history.push(redirectPath);
          }
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

  constructForm = props => {
    const {djangoPath} = props;

    if (!this.formStructureRetrieved) {
      let createForm = formStructure => {
        this.setState(
          {
            formStructure: formStructure
          },
          () => {
            if (props.existingValues) {
              props.initialize(props.existingValues);
            }
          }
        );
        this.formStructureRetrieved = true;
      };
      getFormInfo(props.server, djangoPath, createForm);
    }
  };
  render() {
    const {error, handleSubmit, submitting, prepopulatedValues} = this.props;
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
        let filtered = [];

        if (prepopulatedValues) {
          filtered = prepopulatedValues.map(field => {
            return field.name;
          });
        }

        if (!filtered.includes(field.name)) {
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
        } else {
          return null;
        }
      })
      .filter(field => {
        if (field) {
          return true;
        }
        return false;
      });
    return (
      <div>
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
      </div>
    );
  }
}

export default connect((state, ownProps) => {
  return {
    servers: state.serversettings.servers
  };
}, {})(withRouter(_InlineForm));
