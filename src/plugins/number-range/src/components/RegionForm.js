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

class _RegionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {formStructure: []};
  }
  componentWillReceiveProps(nextProps) {
    // quick check to ensure we have a valid server.
    if (
      this.state.formStructure.length === 0 &&
      nextProps.server &&
      nextProps.server.serverSettingName
    ) {
      getRegionFormStructure(nextProps.server).then(data => {
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
              return fieldObj;
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
        if (field.description.type === "integer") {
          type = "numeric";
        } else if (field.description.type === "booler") {
          type = "checkbox";
        }
        return (
          <FormGroup
            helperText={field.description.help_text}
            label={field.description.label}
            required={field.description.required}>
            <Field
              name={field.name}
              component="input"
              type={type}
              key={field.description.name}
              className="pt-input"
              width={300}
            />
          </FormGroup>
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
  form: "region"
})(_RegionForm);

export default RegionForm;
