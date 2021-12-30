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
import {getFormInfo} from "lib/server-api";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Callout, Intent, FormGroup, Dialog, Button} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import FormPrompt from "./FormPrompt";
import PropTypes from "prop-types";
import {pluginRegistry} from "plugins/pluginRegistration";
export class _PageForm extends Component {
  static propTypes = {
    edit: PropTypes.bool,
    operationId: PropTypes.string.isRequired,
    objectName: PropTypes.string.isRequired,
    djangoPath: PropTypes.string.isRequired,
    parameters: PropTypes.object,
    server: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    existingValues: PropTypes.object,
    fieldElements: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      formStructure: [],
      cancelForm: false
    };
    this.formObject = {}; // populated for updates.
    this.formStructureRetrieved = false;
  }

  componentDidMount() {
    this.constructForm(this.props);
  }

  formatError = error => {
    try {
      let formattedMessage = Object.keys(error.response.body)
        .map(key => {
          return `${this.capitalize(
            key.replace("_", " ")
          )}: ${error.response.body[key].map(innerMsg => {
            return ` ${innerMsg}\n`;
          })}`;
        })
        .join(" ");
      showMessage({
        msg: formattedMessage,
        type: "warning",
        expires_in: 1000
      });
    } catch (e) {
      // ignore an error formatting an error.
      console.log("Error occurred while formatting error msg", e);
    }
  };

  capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Ensure booleans that were never set are {false}
  // and remove empty strings from the postValues
  processUnsetFields = postValues => {
    let processedData = {};
    this.state.formStructure.map(field => {
      if (field.description.type === "boolean") {
        if (!postValues[field.name] && postValues[field.name] !== false) {
          // we are missing this boolean from the submit. Add it.
          processedData[field.name] = false; // we set it as false in validated data.
        }
      }
    });
    // set to null if empty string
    Object.keys(postValues).forEach(item => {
      processedData[item] = postValues[item] === "" ? null : postValues[item];
    });
    return processedData;
  };

  submit = async postValues => {
    let {
      server,
      operationId,
      prepopulatedValues,
      objectName,
      redirectPath,
      parameters,
      submitCallback, // gets called after a response is received.
      submitPrecall // gets called before submit, but after prepopulated values have been added.
    } = this.props;
    if (prepopulatedValues) {
      for (let field of prepopulatedValues) {
        // replaces/sets programmatically.
        postValues[field.name] = field.value;
      }
    }
    let processedData = this.processUnsetFields(postValues);
    if (submitPrecall) {
      // only executed if Form has a submitPrecall prop.
      submitPrecall(processedData, this.props);
    }
    if (parameters) {
      parameters.data = processedData;
    } else {
      parameters = {data: processedData};
    }
    try {
      let client =  await pluginRegistry.getServer(this.props.server).getClient();
      let result = await client.execute({
        operationId: operationId,
        parameters: parameters
      });
      if (submitCallback) {
        // execute post submit logic...
        submitCallback(result);
      }
      if (result.status === 201) {
        showMessage({
          id: "app.common.objectCreatedSuccessfully",
          values: {objectName: objectName},
          type: "success"
        });
      } else if (result.status === 200) {
        showMessage({
          id: "app.common.objectUpdatedSuccessfully",
          values: {objectName: objectName},
          type: "success"
        });
      }
      if (redirectPath) {
        this.props.history.push(redirectPath);
      }
    } catch (error) {
      if (error.name === "OperationNotFoundError" || error.status === 403) {
        console.log(error);
        // this is a permission issue, the operation is unavailable, hence not defined.
        // or it can be a 403.
        this.props.history.push("/access-denied");
        return;
      }
      if (error.status === 400 && error.response && error.response.body) {
        if (
          typeof error.response.body === "object" &&
          error.response.body !== null
        ) {
          this.formatError(error);
        }

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
      if (error.message) {
        showMessage({
          id: "app.common.mainError",
          values: {msg: error.message},
          type: "warning"
        });
      }
    }
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
    const {
      error,
      handleSubmit,
      submitting,
      prepopulatedValues,
      fieldElements
    } = this.props;
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
        if (fieldElements && field.name in fieldElements) {
          // return the element as is with descriptions.
          return (
            <FormGroup
              key={`group-${field.name}`}
              helperText={field.description.help_text}
              label={field.description.label}
              required={field.description.required}>
              {fieldElements[field.name]}
            </FormGroup>
          );
        }
        if (!filtered.includes(field.name)) {
          if (field.description.type === "choice") {
            return (
              <Field
                key={field.name}
                name={field.name}
                type="select"
                component={DefaultField}
                width={300}
                fieldData={field}
                validate={field.validate}>
                <option value="" />
                {field.description.choices.map(choice => {
                  return (
                    <option key={choice.value} value={choice.value}>
                      {choice.display_name}
                    </option>
                  );
                })}
              </Field>
            );
          }
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
        <FormPrompt
          cancelForm={this.state.cancelForm}
          when={!this.props.pristine && !this.props.submitting}
        />
        <form onSubmit={handleSubmit(this.submit.bind(this))}>
          {form}
          <button
            className="pt-button pt-intent-primary"
            type="submit"
            disabled={submitting}>
            <FormattedMessage id="app.common.submit" />
          </button>{" "}
          |{" "}
          <button
            className="pt-button"
            type="button"
            onClick={e => {
              this.setState({cancelForm: true}, () => {
                this.props.history.goBack();
              });
            }}>
            <FormattedMessage id="app.common.cancelSubmit" />
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
}, {})(withRouter(_PageForm));
