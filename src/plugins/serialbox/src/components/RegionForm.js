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
import {postAddRegion} from "../lib/serialbox-api";
import {loadPools} from "../reducers/numberrange";
const React = qu4rtet.require("react");
const {Component} = React;
const {connect} = qu4rtet.require("react-redux");
const {Field, reduxForm, SubmissionError, change} = qu4rtet.require(
  "redux-form"
);
const {getFormInfo} = qu4rtet.require("./lib/server-api");
const {showMessage} = qu4rtet.require("./lib/message");
const {DefaultField} = qu4rtet.require("./components/elements/forms");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const {withRouter} = qu4rtet.require("react-router");

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
  cancel = evt => {
    evt.preventDefault();
    // go back to whence you came
    this.props.history.goBack()
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
                  props.dispatch(change("addRegion", field.name, false));
                }
              }
            }
          }
        );
        this.formStructureRetrieved = true;
      };
      getFormInfo(
        props.server,
        "serialbox/sequential-region-create/",
        createForm
      );
    }
  }

  isEditMode = () => {
    return !!(this.props.location.state && this.props.location.state.editRegion);
  };
  // Handles the RegionForm post.
  submit = postValues => {
    postValues.pool = this.props.pool.machine_name;
    return postAddRegion(this.props.server, postValues, this.isEditMode())
      .then(resp => {
        return Promise.all([resp, resp.json()]);
      })
      .then(proms => {
        if (proms[0].status === 403) {
          pluginRegistry.getHistory().push("/access-denied");
          return;
        }
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
        if (field.name === "pool") {
          type = "hidden";
          field.hidden = true;
        }
        //field.name = field.name.replace(/_/g, "");
        return (
          <Field
            key={field.name}
            name={field.name}
            fieldData={field}
            component={DefaultField}
            type={type}
            className="bp3-input"
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
      <form onSubmit={handleSubmit(this.submit.bind(this))}>
        {form}
        <button
          className="bp3-button bp3-intent-primary"
          type="submit"
          disabled={this.props.submitting}>
          Submit
        </button>
        <button
          style={{marginLeft: "10px"}}
          className="bp3-button"
          onClick={this.cancel}>
          Cancel
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
