// Copyright (c) 2018 Serial Lab
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
import {loadPageTitle} from "../../reducers/layout";

/**
 * LeftPanel
 *
 * @param {object} props Takes a title and children elems.
 *
 * @return {ReactElement} The left panel element.
 */
class _LeftPanel extends Component {
  render() {
    return (
      <div className="left-panel pt-dark">
        <h4 className="left-panel-title">
          {/* We use a new message from passed props because Redux uses plain objects. */}
          <FormattedMessage {...this.props.pageTitle} />
        </h4>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

export const LeftPanel = connect(
  (state, ownProps) => {
    return {
      pageTitle: state.layout.pageTitle
    };
  },
  {loadPageTitle}
)(_LeftPanel);

/**
 * RightPanel
 *
 * @param {object} props Children elements.
 *
 * @return {ReactElement} The right panel element.
 */
class _RightPanel extends Component {
  componentDidMount() {
    //this.props.loadPageTitle(this.props.title.props.id);
    this.props.loadPageTitle({...this.props.title.props});
  }
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.title.props) !==
      JSON.stringify(this.props.pageTitle)
    ) {
      // formattedMessage props have changed.
      this.props.loadPageTitle({...nextProps.title.props});
    }
  }
  render() {
    return (
      <div className="right-panel">
        <div>{this.props.children}</div>
      </div>
    );
  }
}

export const RightPanel = connect(
  (state, ownProps) => {
    return {
      pageTitle: state.layout.pageTitle
    };
  },
  {loadPageTitle}
)(_RightPanel);

/**
 * Default - function returning a left/right panel layout.
 *
 *
 * @param {Object} props title/leftPanel/rightPanel jsx
 *
 * @return {ReactElement} The layout element
 */
class _Panels extends Component {
  render() {
    return <div className="main-container">{this.props.children}</div>;
  }
}

export const Panels = connect(
  (state, ownProps) => {
    return {
      pageTitle: state.layout.pageTitle
    };
  },
  {loadPageTitle}
)(_Panels);
