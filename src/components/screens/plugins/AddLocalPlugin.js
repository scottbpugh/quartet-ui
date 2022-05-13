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
import {Field, reduxForm} from "redux-form";
import {FormGroup, Intent, Button} from "@blueprintjs/core";
import {RightPanel} from "components/layouts/Panels";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {addLocalPlugin} from "reducers/plugins";

const FORM_NAME = "addPlugin";

class _AddLocalPlugin extends Component {
  submit = postValues => {
    // add the flag it's a local plugin.
    postValues["local"] = true;
    postValues["core"] = false;
    this.props.addLocalPlugin(postValues);
    this.props.history.push("/plugins");
  };
  render() {
    return (
      <RightPanel title={<FormattedMessage id="app.plugins.addPluginForm" />}>
        <form onSubmit={this.props.handleSubmit(this.submit.bind(this))}>
          <div>
            <FormGroup
              helperText="The name of the plugin, for programmatic use. Alphanumeric with dashes and underscores."
              label="Plugin Name"
              require={true}>
              <Field
                className="pt-input"
                name="pluginName"
                component="input"
                type="text"
                placeholder="Plugin Name"
              />
            </FormGroup>
            <FormGroup
              helperText="The path to initialize the plugin. The file containing enable and disable."
              label="Init Path"
              require={true}>
              <Field
                className="pt-input"
                name="initPath"
                component="input"
                type="text"
                placeholder="Init Path"
              />
            </FormGroup>
            <FormGroup
              helperText="The path to the preview thumbnail"
              label="preview">
              <Field
                className="pt-input"
                name="preview"
                component="input"
                type="text"
                placeholder="Preview Path"
              />
            </FormGroup>
            <FormGroup
              helperText="The name as it will appear in the plugin list"
              label="Readable Name">
              <Field
                className="pt-input"
                name="readableName"
                component="input"
                type="text"
                placeholder="Readable Name"
                require={true}
              />
            </FormGroup>
            <FormGroup
              helperText="The package path or package name in NPM."
              label="Package Path">
              <Field
                className="pt-input"
                name="packagePath"
                component="input"
                type="text"
                placeholder="Package Path or NPM package name"
                require={true}
              />
            </FormGroup>
            <FormGroup
              helperText="The description of what this plugin does."
              label="Description">
              <Field
                className="pt-input"
                name="description"
                component="input"
                type="text"
                placeholder="Description"
                require={true}
              />
            </FormGroup>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </RightPanel>
    );
  }
}

export default connect(
  (state, ownProps) => {
    initialValues: ownProps.initialValues || {};
  },
  {addLocalPlugin}
)(reduxForm({form: FORM_NAME})(_AddLocalPlugin));
