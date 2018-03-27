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
import {TreeNode} from "components/layouts/elements/NavTree";
import {
  Menu,
  MenuItem,
  MenuDivider,
  Dialog,
  Button,
  ButtonGroup,
  ContextMenu,
  RadioGroup,
  Radio,
  Label
} from "@blueprintjs/core";
import {pluginRegistry} from "plugins/pluginRegistration";
import {withRouter} from "react-router";
import {DeleteDialog} from "components/elements/DeleteDialog";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {deleteRule, deleteStep} from "../reducers/capture";

class StepItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      collapsed: true
    };
  }
  activateNode(currentPath) {
    const {serverID, step} = this.props;
    let regexp = new RegExp(
      `capture/.*/${serverID}.*${step.rule}.*${step.name}`
    );
    this.setState({active: regexp.test(currentPath)});
  }
  componentDidMount() {
    this.activateNode(this.props.currentPath);
  }
  componentWillReceiveProps(nextProps) {
    this.activateNode(nextProps.currentPath);
  }
  toggleConfirmDelete = evt => {
    this.setState({isConfirmDeleteOpen: !this.state.isConfirmDeleteOpen});
  };
  trashStep = evt => {
    const {serverID, step, deleteRule} = this.props;
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
      pathname: `/capture/edit-step/${this.props.serverID}/${step.rule}/${
        step.name
      }`,
      state: {defaultValues: step, edit: true}
    });
  };
  renderContextMenu() {
    const {server, serverID, step} = this.props;
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
      </Menu>
    );
  }
  goTo = path => {
    this.props.history.push(path);
  };
  render() {
    const {step, depth} = this.props;
    return (
      <TreeNode
        depth={depth}
        onContextMenu={this.renderContextMenu.bind(this)}
        onClick={this.goToEdit.bind(this)}
        collapsed={this.state.collapsed}
        active={this.state.active}
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
      active: false,
      collapsed: true
    };
  }
  activateNode(currentPath) {
    const {serverID} = this.props;
    let regexp = new RegExp(`capture/.*/${serverID}.*${this.props.rule.name}`);
    this.setState({active: regexp.test(currentPath)});
  }
  componentDidMount() {
    this.activateNode(this.props.currentPath);
  }
  componentWillReceiveProps(nextProps) {
    this.activateNode(nextProps.currentPath);
  }
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
  goToEdit = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    let {rule} = this.props;
    ContextMenu.hide();
    this.props.history.push({
      pathname: `/capture/add-rule/${this.props.serverID}/${rule.name}`,
      state: {defaultValues: rule, edit: true}
    });
  };
  toggleConfirmDelete = evt => {
    this.setState({isConfirmDeleteOpen: !this.state.isConfirmDeleteOpen});
  };
  renderContextMenu() {
    const {server, serverID, rule} = this.props;
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
            `/capture/add-step/${serverID}/${rule.name}`
          )}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.capture.addStep"
          })}
        />

        <MenuItem
          onClick={this.goTo.bind(
            this,
            `/capture/add-task/${serverID}/${rule.name}`
          )}
          text={
            pluginRegistry.getIntl().formatMessage({
              id: "plugins.capture.uploadFile"
            }) +
            " " +
            rule.name
          }
        />
        <MenuItem
          onClick={this.goTo.bind(
            this,
            `/capture/add-task/${serverID}/${rule.name}`
          )}
          text={
            pluginRegistry.getIntl().formatMessage({
              id: "plugins.capture.addTask"
            }) + " - Dev"
          }
        />
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
        onClick={this.goToEdit.bind(this)}
        collapsed={this.state.collapsed}
        active={this.state.active}
        childrenNodes={steps}>
        {rule.name}
        <DeleteDialog
          isOpen={this.state.isConfirmDeleteOpen}
          title={<FormattedMessage id="plugins.capture.deleteRule" />}
          body={<FormattedMessage id="plugins.capture.deleteRuleConfirm" />}
          toggle={this.toggleConfirmDelete.bind(this)}
          deleteAction={this.trashRule.bind(this)}
        />
      </TreeNode>
    );
  }
}

export const RuleItem = connect(
  state => {
    return {};
  },
  {deleteRule, deleteStep}
)(withRouter(_RuleItem));
