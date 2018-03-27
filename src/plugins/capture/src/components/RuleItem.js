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

class StepItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      collapsed: true
    };
  }
  goTo = path => {
    this.props.history.push(path);
  };
  render() {
    const {step, depth} = this.props;
    return (
      <TreeNode
        depth={depth}
        collapsed={this.state.collapsed}
        active={this.state.active}
        childrenNodes={[]}>
        {step.name}
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
  goTo = path => {
    this.props.history.push(path);
  };
  renderContextMenu() {
    const {server, serverID, rule} = this.props;
    return (
      <Menu>
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
        {/*<MenuItem
          onClick={this.goTo.bind(
            this,
            `/capture/add-task/${serverID}/${rule.name}`
          )}
          text={pluginRegistry.getIntl().formatMessage({
            id: "plugins.capture.addTask"
          })}
        />*/}
      </Menu>
    );
  }
  render() {
    const {rule, depth} = this.props;
    let steps = rule.steps.map(step => {
      return <StepItem step={step} history={this.props.history} />;
    });
    return (
      <TreeNode
        onContextMenu={this.renderContextMenu.bind(this)}
        depth={depth}
        collapsed={this.state.collapsed}
        active={this.state.active}
        childrenNodes={steps}>
        {rule.name}
      </TreeNode>
    );
  }
}

export const RuleItem = withRouter(_RuleItem);
