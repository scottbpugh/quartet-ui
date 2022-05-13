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
import {TreeNode} from "components/layouts/elements/TreeNode";
import {
  Menu,
  MenuItem,
  MenuDivider,
  Dialog,
  Button,
  ButtonGroup,
  ContextMenu,
  FileUpload
} from "@blueprintjs/core";
import {pluginRegistry} from "plugins/pluginRegistration";
import {withRouter} from "react-router";
import {DeleteDialog} from "components/elements/DeleteDialog";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {deleteStep, deleteRule} from "../reducers/capture";
import {fileUpload} from "../lib/capture-api";
import classNames from "classnames";
import {showMessage} from "lib/message";

class StepItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }
  toggleConfirmDelete = evt => {
    this.setState({isConfirmDeleteOpen: !this.state.isConfirmDeleteOpen});
  };
  trashStep = evt => {
    const {serverID, step} = this.props;
    const serverObject = pluginRegistry.getServer(serverID);
    this.toggleConfirmDelete();
    ContextMenu.hide();
    this.props.deleteStep(serverObject, step);
    this.props.history.push(`/capture/rules/${serverObject.serverID}`);
  };
  goToEdit = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    let {step} = this.props;
    ContextMenu.hide();
    this.props.history.push({
      pathname: `/capture/edit-step/${this.props.serverID}/rule/${
        step.rule
      }/step/${step.id}`,
      state: {defaultValues: step, edit: true}
    });
  };
  renderContextMenu() {
    const {step, serverID} = this.props;
    return (
      <Menu>
        <ButtonGroup className="context-menu-control" minimal={true}>
          <Button small={true} onClick={this.goToEdit} iconName="edit" />
          <Button
            small={true}
            onClick={this.toggleConfirmDelete}
            iconName="trash"
          />
        </ButtonGroup>
        <MenuDivider title={step.name} />
        <MenuItem
          onClick={this.goTo.bind(
            this,
            `/capture/add-step-param/${serverID}/rule/${step.rule}/step/${
              step.id
            }`
          )}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.capture.addStepParam"
          })}
        />
      </Menu>
    );
  }
  goTo = path => {
    this.props.history.push(path);
  };
  render() {
    const {step, depth, serverID} = this.props;
    return (
      <TreeNode
        depth={depth}
        nodeType="step"
        onContextMenu={this.renderContextMenu.bind(this)}
        onClick={this.goToEdit.bind(this)}
        path={`/capture/edit-step/${serverID}/rule/${step.rule}/step/${
          step.id
        }`}
        collapsed={this.state.collapsed}
        childrenNodes={[]}>
        {step.name}
        <DeleteDialog
          isOpen={this.state.isConfirmDeleteOpen}
          title={<FormattedMessage id="plugins.capture.deleteStep" />}
          body={<FormattedMessage id="plugins.capture.deleteStepConfirm" />}
          toggle={this.toggleConfirmDelete.bind(this)}
          deleteAction={this.trashStep.bind(this)}
        />
      </TreeNode>
    );
  }
}

class _RuleItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      isUploadOpen: false
    };
  }
  toggleUpload = () => {
    const {serverID} = this.props;
    this.goTo(`/capture/tasks/${serverID}`);
    this.setState({isUploadOpen: !this.state.isUploadOpen});
  };
  trashRule = evt => {
    const {serverID, rule, deleteRule} = this.props;
    const serverObject = pluginRegistry.getServer(serverID);
    this.toggleConfirmDelete();
    ContextMenu.hide();
    deleteRule(serverObject, rule);
    this.props.history.push(`/capture/rules/${serverObject.serverID}`);
  };
  goTo = path => {
    this.props.history.push(path);
  };
  uploadFile = evt => {
    this.toggleUpload();
    fileUpload(
      pluginRegistry.getServer(this.props.serverID),
      this.props.rule,
      evt.target.files[0]
    );
    showMessage({
      id: "plugins.capture.uploadedFile",
      type: "success",
      values: {ruleName: this.props.rule.name}
    });
  };
  goToEdit = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    let {rule} = this.props;
    ContextMenu.hide();
    this.props.history.push({
      pathname: `/capture/add-rule/${this.props.serverID}/rule/${rule.id}`
    });
  };
  toggleConfirmDelete = evt => {
    this.setState({isConfirmDeleteOpen: !this.state.isConfirmDeleteOpen});
  };
  renderContextMenu() {
    const {serverID, rule} = this.props;
    return (
      <Menu>
        <ButtonGroup className="context-menu-control" minimal={true}>
          <Button small={true} onClick={this.goToEdit} iconName="edit" />
          <Button
            small={true}
            onClick={this.toggleConfirmDelete}
            iconName="trash"
          />
        </ButtonGroup>
        <MenuDivider title={rule.name} />
        <MenuDivider />
        <MenuItem
          onClick={this.goTo.bind(
            this,
            `/capture/add-step/${serverID}/rule/${rule.id}`
          )}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.capture.addStep"
          })}
        />
        <MenuItem
          onClick={this.goTo.bind(
            this,
            `/capture/add-rule-param/${serverID}/rule/${rule.id}`
          )}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.capture.addRuleParam"
          })}
        />
        <MenuItem
          onClick={this.toggleUpload}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.capture.uploadFile"
          })}
        />
        {/*
        <MenuItem
          onClick={this.goTo.bind(
            this,
            `/capture/add-task/${serverID}/rule/${rule.id}`
          )}
          text={
            pluginRegistry.getIntl().formatMessage({
              id: "plugins.capture.addTask"
            }) + " - Dev"
          }
        />*/}
      </Menu>
    );
  }

  render() {
    const {rule, depth, currentPath} = this.props;
    let steps = rule.steps.map(step => {
      return (
        <StepItem
          key={step.name}
          step={step}
          depth={depth}
          currentPath={currentPath}
          serverID={this.props.serverID}
          history={this.props.history}
          deleteStep={this.props.deleteStep}
        />
      );
    });
    return (
      <TreeNode
        onContextMenu={this.renderContextMenu.bind(this)}
        depth={depth}
        nodeType="rule"
        path={`/capture/add-rule/${this.props.serverID}/rule/${rule.id}`}
        onClick={this.goToEdit.bind(this)}
        collapsed={this.state.collapsed}
        childrenNodes={[
          <TreeNode
            key={`step-parent`}
            nodeType="step"
            depth={depth}
            childrenNodes={steps}>
            <FormattedMessage id="plugins.capture.steps" />
          </TreeNode>
        ]}>
        {rule.name}
        <DeleteDialog
          isOpen={this.state.isConfirmDeleteOpen}
          title={<FormattedMessage id="plugins.capture.deleteRule" />}
          body={<FormattedMessage id="plugins.capture.deleteRuleConfirm" />}
          toggle={this.toggleConfirmDelete.bind(this)}
          deleteAction={this.trashRule.bind(this)}
        />
        <Dialog
          isOpen={this.state.isUploadOpen}
          onClose={this.toggleUpload}
          title={
            <FormattedMessage
              id="plugins.capture.uploadFileTitle"
              values={{ruleName: rule.name}}
            />
          }
          className={classNames({
            "pt-dark": this.props.theme.startsWith("dark") ? true : false
          })}>
          <div className="pt-dialog-body">
            <div className="mini-form">
              <FileUpload
                text="Choose file..."
                onInputChange={this.uploadFile}
              />
            </div>
          </div>
        </Dialog>
      </TreeNode>
    );
  }
}

export const RuleItem = connect(
  state => {
    return {
      theme: state.layout.theme
    };
  },
  {deleteRule, deleteStep}
)(withRouter(_RuleItem));
