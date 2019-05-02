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
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AddServerButton } from "components/screens/server/AddServerButton";
import { GoBackButton } from "components/layouts/elements/GoBackButton";
import { PrintButton } from "components/screens/printing/PrintButton";
import classNames from "classnames";

export class _ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { isDark: this.isDark(this.props.theme) };
  }
  goTo = path => {
    this.props.history.push(path);
  };
  componentDidMount() {
    this.setState({ isDark: this.isDark(this.props.theme) });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ isDark: this.isDark(nextProps.theme) });
  }
  isDark = theme => {
    if (theme === "polar") {
      return false;
    }
    return true;
  };
  render() {
    const { controlButtons } = this.props;
    let pluginButtons = controlButtons
      ? Object.keys(controlButtons).map(componentName => {
        let ComponentClass = pluginRegistry.getRegisteredComponent(
          componentName
        );
        return (
          <ComponentClass
            key={componentName}
            theme={this.props.theme}
            currentPath={this.props.currentPath}
          />
        );
      })
      : [];
    return (
      <div className="leftbar-group">
        <div
          className={classNames({
            "pt-button-group": true,
            "pt-minimal": true,
            "pt-dark": this.state.isDark
          })}>
          <button
            onClick={this.goTo.bind(this, "/")}
            tabIndex="0"
            className={classNames({
              "pt-button": true,
              "pt-icon-home": true
            })}
          />
          <GoBackButton
            history={this.props.history}
            currentPath={this.props.currentPath}
            isDark={this.state.isDark}
          />
          <AddServerButton
            history={this.props.history}
            isDark={this.state.isDark}
          />
          <PrintButton
            history={this.props.history}
            isDark={this.state.isDark}
          />
          {pluginButtons}
        </div>
      </div>
    );
  }
}

export const ControlPanel = connect((state, ownProps) => {
  return {
    currentPath: state.layout.currentPath,
    theme: state.layout.theme,
    controlButtons: state.plugins.controlButtons,
    messages: state.intl.messages
  };
})(withRouter(_ControlPanel));
