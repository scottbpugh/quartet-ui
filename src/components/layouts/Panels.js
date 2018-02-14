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
export const LeftPanel = props => (
  <div className="left-panel pt-dark">
    <h4 className="left-panel-title">{props.title}</h4>
    <div>{props.children}</div>
  </div>
);

/**
 * RightPanel
 *
 * @param {object} props Children elements.
 *
 * @return {ReactElement} The right panel element.
 */
export const RightPanel = props => (
  <div className="right-panel">
    <div>{props.children}</div>
  </div>
);

/**
 * Default - function returning a left/right panel layout.
 *
 *
 * @param {Object} props title/leftPanel/rightPanel jsx
 *
 * @return {ReactElement} The layout element
 */
class _Panels extends Component {
  componentDidMount() {
    if (typeof this.props.title === "object") {
      // this is a formatted message
      this.props.loadPageTitle(this.props.title.props.id);
    } else {
      // treating it as a string
      this.props.loadPageTitle(this.props.title);
    }
  }
  render() {
    if (this.props.children && this.props.children.length === 2) {
      // dynamically pass title
      let titledLeftPanel = React.cloneElement(this.props.children[0], {
        title: this.props.pageTitle
      });
      // nested object version.
      return <div className="main-container">{this.props.children[1]}</div>;
    }

    // otherwise expect props leftPanel, title, and right Panel
    return <div className="right-panel">{this.props.rightPanel}</div>;
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
