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
import {clipboard} from "electron";
import React, {Component} from "react";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router-dom";
import {Icon} from "@blueprintjs/core";
import classNames from "classnames";
import {NavTree} from "components/layouts/elements/NavTree";
import {ControlPanel} from "components/layouts/elements/ControlPanel";
import {LeftPanel, Panels, RightPanel} from "components/layouts/Panels";
import {showMessage} from "lib/message";

class _ScreenErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {error: null, errorInfo: null};
  }
  takeMeBack = () => {
    this.props.history.push("/");
    this.setState({error: null, errorInfo: null});
  };
  copyErrorMessage = () => {
    clipboard.writeText(this.state.errorMessage);
    showMessage({id: "app.common.messageCopiedToClipboard", type: "success"});
  };
  constructErrorFeedback = (error, errorInfo) => {
    if (error.stack) {
      return `${error.stack.toString()}`;
    }
    return `${error.toString()}`;
  };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorMessage: this.constructErrorFeedback(error, errorInfo)
    });
  }
  render() {
    if (this.state.errorInfo) {
      return (
        <Panels key={`error-${this.state.errorInfo ? true : false}`}>
          <LeftPanel key="leftpanel" />

          <RightPanel
            key="AccessDenied"
            title={
              <FormattedMessage id="app.common.screenErrorBoundaryTitle" />
            }>
            <div
              className={classNames({
                "single-column-center-msg": true,
                "pt-dark": this.props.theme && this.props.theme === "contrasted"
              })}>
              {this.props.theme &&
              (this.props.theme.startsWith("dark") ||
                this.props.theme === "contrasted") ? (
                <img
                  className="lock-animation dark-lock"
                  src="../svgs/quartet-lock.svg"
                  width="40%"
                />
              ) : (
                <img
                  className="lock-animation light-lock"
                  src="../svgs/quartet-lock-dark.svg"
                  width="40%"
                />
              )}
              <h5 className="access-denied-title">
                <FormattedMessage id="app.common.screenErrorBoundaryTitle" />
              </h5>
              <div className="access-denied-blurb">
                <FormattedMessage id="app.common.screenErrorBoundaryBlurb" />
                <div
                  className="button-shelf"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "15px 0",
                    justifyContent: "flex-end"
                  }}>
                  <button
                    onClick={this.takeMeBack}
                    style={{alignSelf: "flex-end", margin: "0 0 0 10px"}}
                    className="pt-button pt-intent-primary">
                    <FormattedMessage id="app.common.takeMeBack" />
                  </button>
                  <button
                    onClick={this.copyErrorMessage}
                    style={{alignSelf: "flex-end", margin: "0 0 0 10px"}}
                    className="pt-button">
                    <FormattedMessage id="app.common.copyErrorMessage" />
                  </button>
                </div>
                <pre style={{whiteSpace: "pre-wrap"}}>
                  {this.state.errorMessage}
                </pre>
              </div>
            </div>
          </RightPanel>
        </Panels>
      );
    }
    return this.props.children;
  }
}

export const ScreenErrorBoundary = connect(
  state => ({theme: state.layout.theme}),
  {}
)(_ScreenErrorBoundary);
