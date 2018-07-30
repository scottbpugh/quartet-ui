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
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router-dom";
import {RightPanel} from "components/layouts/Panels";
import classNames from "classnames";
import "./AccessDenied.css";

export class _AccessDenied extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <RightPanel
        key="AccessDenied"
        title={<FormattedMessage id="app.common.accessDeniedTitle" />}>
        <div
          className={classNames({
            "access-denied-contents": true,
            "pt-dark": this.props.theme && this.props.theme === "contrasted"
          })}>
          {this.props.theme &&
          (this.props.theme.startsWith("dark") ||
            this.props.theme === "contrasted") ? (
            <img
              className="lock-animation dark-lock"
              src="../svgs/quartet-lock.svg"
              width="60%"
            />
          ) : (
            <img
              className="lock-animation light-lock"
              src="../svgs/quartet-lock-dark.svg"
              width="60%"
            />
          )}
          <h5 className="access-denied-title">
            <FormattedMessage id="app.common.accessDeniedTitle" />
          </h5>
          <div className="access-denied-blurb">
            <FormattedMessage id="app.common.accessDeniedBlurb" />
          </div>
          <button
            onClick={e => {
              this.props.history.go(-2);
            }}
            style={{alignSelf: "flex-end"}}
            className="pt-button pt-intent-primary">
            <FormattedMessage id="app.common.takeMeBack" />
          </button>
        </div>
      </RightPanel>
    );
  }
}

export const AccessDenied = connect((state, ownProps) => {
  return {theme: state.layout.theme};
})(withRouter(_AccessDenied));
