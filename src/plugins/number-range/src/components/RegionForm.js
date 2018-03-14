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
import {Field, reduxForm, change} from "redux-form";
import {getRegionFormStructure} from "../lib/serialbox-api";
import {postAddRegion} from "../lib/serialbox-api";
import {SubmissionError} from "redux-form";
import {showMessage} from "lib/message";
import {DefaultField, getSyncValidators} from "components/elements/forms";
import {connect} from "react-redux";
import {loadPools} from "../reducers/numberrange";
import {withRouter} from "react-router-dom";

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
              fieldObj.validate = getSyncValidators(fieldObj);
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
            if (props.location.state && props.location.state.defaultValues) {
              // fed existing values.
              props.initialize(props.location.state.defaultValues);
            }
          }
        );
      });
    }
  }

  // Handles the RegionForm post.
  submit = postValues => {
    postValues.pool = this.props.pool.machine_name;
    let editMode =
      this.props.location.state && this.props.location.state.editRegion
        ? true
        : false;
    return postAddRegion(this.props.server, postValues, editMode)
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
          } else if (proms[0].status === 200) {
            showMessage({
              msg: "Existing region updated successfully",
              type: "success"
            });
          }
          setTimeout(() => {
            // tiny bit of padding.
            this.props.history.push(
              `/number-range/region-detail/${this.props.server.serverID}/${
                this.props.pool.machine_name
              }`
            );
          }, 100);

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
          return true;
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

export default connect(state => ({nr: state.numberrange.servers}), {loadPools})(
  withRouter(RegionForm)
);
