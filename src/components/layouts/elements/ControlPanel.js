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
import {switchVisibility} from "reducers/layout";
import {serverVisibility} from "reducers/layout";
import {Popover, Position} from "@blueprintjs/core";
import {IntlProvider} from "react-intl-redux";
import {FormattedMessage} from "react-intl";
import swal from '@sweetalert/with-react';

export class _ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { isDark: this.isDark(this.props.theme) };
  }
  goTo = path => {
    this.props.history.push(path);
  };
  componentDidMount() {
    this.props.switchVisibility(true);
    this.props.serverVisibility([]);
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
  changeVisibility = () => {
    if (this.props.intl.locale === "en-US") {
      swal({
        icon: "warning",
        buttons: [true, true],
        content: (
          <div className='prompt_container'>
            <img src='./components/layouts/elements/icon.png' />
            {this.props.visibility ? 
            ("Would you like to hide inactive servers?") : ("Would you like to unhide inactive servers?")
            }
          </div>
        )
      })
      .then((willHide) => {
        if (willHide) {
          swal(this.props.visibility ? 
            ("INACTIVE SERVERS HIDED") : ("INACTIVE SERVERS UNHIDED"), {
            icon: "success",
          });
          this.props.switchVisibility(!this.props.visibility)
        } 
      })
    } else if (this.props.intl.locale === "fr-FR") {
      /* Here it if possibility to add prompts in other languages */
      // swal({
      //   icon: "warning",
      //   buttons: ["X","✓"],
      //   content: (
      //     <div></div>
      //   )
      // })
      // .then((willHide) => {
      //   if (willHide) {
      //     swal("", {
      //       icon: "success",
      //     });
      //     this.props.switchVisibility(!this.props.visibility)
      //   } 
      // })
    }
  }
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
          <div onClick={() => this.changeVisibility()}>
            <Popover
              className={classNames({"pt-dark": this.props.isDark})}
              position={Position.RIGHT_CENTER}
            >
              <button
                tabIndex="0"
                className={
                  classNames({
                    "pt-button pt-icon-eye-open": this.props.visibility,
                    "pt-button pt-icon-eye-off button-bg-red red tomato-red": !this.props.visibility
                  })
                }
              >
              </button>
            </Popover>
          </div>
          {pluginButtons}
        </div>
      </div>
    );
  }
}

export const ControlPanel = connect(
  state => ({
    currentPath: state.layout.currentPath,
    theme: state.layout.theme,
    controlButtons: state.plugins.controlButtons,
    messages: state.intl.messages,
    visibility: state.layout.visibility,
    intl: state.intl,
    serverVis: state.layout.serverVis,
  }),
  {switchVisibility, serverVisibility}
)(withRouter(_ControlPanel));
