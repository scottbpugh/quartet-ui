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
import {Field, reduxForm, SubmissionError, change} from "redux-form";
import {getFormInfo} from "lib/auth-api";
import {postAddPool} from "../lib/serialbox-api";
import {showMessage} from "lib/message";
import {loadPools} from "../reducers/numberrange";
import {connect} from "react-redux";
import {DefaultField} from "components/elements/forms";
import {pluginRegistry} from "plugins/pluginRegistration";
import {withRouter} from "react-router";

class _PoolForm extends Component {
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
  cancel = evt => {
    evt.preventDefault();
    if (this.isEditMode()) {
      this.props.history.push(
        `/number-range/region-detail/${this.props.match.params.serverID}/${
          this.props.match.params.poolName
        }`
      );
    } else {
      this.props.history.push(
        `/number-range/pools/${this.props.match.params.serverID}/`
      );
    }
  };

  constructForm(props) {
    if (
      this.state.formStructure.length === 0 &&
      props.server &&
      props.server.serverSettingName
    ) {
      let createForm = formStructure => {
        this.setState(
          {
            formStructure: formStructure
          },
          () => {
            if (
              props.location &&
              props.location.state &&
              props.location.state.defaultValues
            ) {
              // fed existing values.
              props.initialize(props.location.state.defaultValues);
            } else {
              // After state has been rendered,
              // initialize checkboxes as false by default to prevent them
              // from being missing in post.
              for (let field of this.state.formStructure) {
                if (field.description.type === "boolean") {
                  debugger;
                  props.dispatch(change("addPool", field.name, false));
                }
              }
            }
          }
        );
        this.formStructureRetrieved = true;
      };
      getFormInfo(props.server, "serialbox/pool-create/", createForm);
    }
  }

  isEditMode = () => {
    return this.props.location &&
      this.props.location.state &&
      this.props.location.state.editPool
      ? true
      : false;
  };
  // Handles the RegionForm post.
  submit = postValues => {
    debugger;
    return postAddPool(
      pluginRegistry.getServer(this.props.server.serverID),
      postValues,
      this.isEditMode()
    )
      .then(resp => {
        return Promise.all([resp, resp.json()]);
      })
      .then(proms => {
        // we handle the success here.
        if (proms[0].ok) {
          if (proms[0].status === 201) {
            showMessage({
              msg: "New pool created successfully",
              type: "success"
            });
            this.props.history.push(
              "/number-range/pools/" + this.props.server.serverID
            );
          } else if (proms[0].status === 200) {
            showMessage({
              msg: "Existing pool updated successfully",
              type: "success"
            });
          }
          this.props.loadPools(
            pluginRegistry.getServer(this.props.server.serverID)
          );
          setTimeout(() => {
            // tiny bit of padding.
            this.props.history.push(
              `/number-range/pools/${this.props.server.serverID}`
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
        <button
          style={{marginLeft: "10px"}}
          className="pt-button"
          onClick={this.cancel}>
          Cancel
        </button>
      </form>
    );
  }
}

let PoolForm = reduxForm({
  form: "addPool"
})(_PoolForm);

export default connect(
  (state, ownProps) => {
    return {
      servers: state.serversettings.servers,
      nr: state.numberrange.servers
    };
  },
  {loadPools}
)(withRouter(PoolForm));
