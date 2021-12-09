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
import {pluginRegistry} from "plugins/pluginRegistration";
import {TreeNode} from "components/layouts/elements/TreeNode";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {
  Menu,
  MenuItem,
  MenuDivider,
  Dialog,
  FileUpload
} from "@blueprintjs/core";
import {loadRules} from "../reducers/capture";
import classNames from "classnames";
import {fileUpload} from "../lib/capture-api";
import {showMessage} from "lib/message";

class _NavPluginRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {isUploadOpen: false, rule: null};
  }
  static get PLUGIN_COMPONENT_NAME() {
    return "TaskTopNav";
  }
  serverHasCapture() {
    return pluginRegistry
      .getServer(this.props.serverID)
      .appList.includes("capture");
  }
  toggleUpload = () => {
    const {serverID} = this.props;
    this.goTo(`/capture/tasks/${serverID}`);
    this.setState({isUploadOpen: !this.state.isUploadOpen});
  };
  ruleSelect = evt => {
    this.setState({
      rule: this.props.rules.find(rule => rule.id === Number(evt.target.value))
    });
  };
  uploadFile = evt => {
    this.toggleUpload();
    fileUpload(
      pluginRegistry.getServer(this.props.serverID),
      this.state.rule,
      evt.target.files[0]
    );
    showMessage({
      id: "plugins.capture.uploadedFile",
      type: "success",
      values: {ruleName: this.state.rule.name}
    });
  };
  goTo = path => {
    this.props.history.push(path);
  };

  renderContextMenu = () => {
    const {server} = this.props;
    return (
      <Menu>
        <MenuDivider title={server.serverSettingName} />
        <MenuDivider />
        <MenuItem
          onClick={this.toggleUpload.bind(this)}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.capture.addTask"
          })}
        />
      </Menu>
    );
  };
  render() {
    const {serverID} = this.props;
    if (this.serverHasCapture()) {
      let children = [];
      return (
        <TreeNode
          depth={this.props.depth}
          onContextMenu={this.renderContextMenu.bind(this)}
          nodeType="task"
          path={`/capture/tasks/${serverID}`}
          childrenNodes={children}>
          <FormattedMessage id="plugins.capture.tasksTopNav" />
          <Dialog
            isOpen={this.state.isUploadOpen}
            onClose={this.toggleUpload}
            title={<FormattedMessage id="plugins.capture.addTask" />}
            className={classNames({
              "pt-dark": this.props.theme.startsWith("dark") ? true : false
            })}>
            <div className="pt-dialog-body">
              <div className="mini-form">
                <div style={{marginBottom: "20px"}}>
                  <div className="pt-select">
                    <select
                      onChange={this.ruleSelect.bind(this)}
                      value={this.state.rule ? this.state.rule.id : null}>
                      <option selected>
                        {pluginRegistry
                          .getIntl()
                          .formatMessage({id: "plugins.capture.selectRule"})}
                      </option>
                      {this.props.rules
                        ? this.props.rules.map(rule => {
                            return (
                              <option rule={rule} value={rule.id}>
                                {rule.name}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </div>
                </div>
                <div>
                  <FileUpload
                    disabled={[null, undefined].includes(this.state.rule)}
                    text="Choose file..."
                    onInputChange={this.uploadFile.bind(this)}
                  />
                </div>
              </div>
            </div>
          </Dialog>
        </TreeNode>
      );
    }
    return (
      <TreeNode depth={this.props.depth} childrenNodes={[]}>
        <i>
          <FormattedMessage id="plugins.capture.noRuleFound" />
        </i>
      </TreeNode>
    );
  }
}

export const TasksTopNav = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.serverID],
      rules:
        state.capture.servers && state.capture.servers[ownProps.serverID]
          ? state.capture.servers[ownProps.serverID].rules
          : [],
      currentPath: state.layout.currentPath,
      theme: state.layout.theme
    };
  },
  {loadRules}
)(withRouter(_NavPluginRoot));
