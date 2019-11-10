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
import {loadPageTitle} from "../../reducers/layout";
import "react-resizable/css/styles.css";
import {ResizableBox} from "react-resizable";
import "./panels.css";

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
      <ResizableBox className="left-panel" axis="x" width={300}>
        {/* <div className="left-panel"> */}
        <h4 className="left-panel-title bp3-dark">
          {/* We use a new message from passed props because Redux uses plain objects. */}
          <FormattedMessage {...this.props.pageTitle} />
        </h4>
        <div
          style={{
            overflowX: "hidden",
            overflowY: "hidden",
            whiteSpace: "nowrap"
          }}>
          {this.props.children}
        </div>
        {/* </div> */}
      </ResizableBox>
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

  loadTitle() {
    if (typeof this.props.title === "string") {
      this.props.loadPageTitle({id: "plugins.unimplemented.noTitle", defaultMessage: this.props.title});
    } else {
      this.props.loadPageTitle({...this.props.title.props});
    }
  }

  componentDidMount() {
    // this.props.loadPageTitle(this.props.title.props.id);
    this.loadTitle(this.props.title);
  }

  render() {
    return (
      <div className="right-panel">
        <div ref="rightPanel">{this.props.children}</div>
      </div>
    );
  }
}

export const RightPanel = connect(
  (state, ownProps) => {
    return {
      pageTitle: state.layout.pageTitle,
      currentPath: state.layout.currentPath
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
    const clonedChildren = this.props.children.map((child, index) => {
      if (index === 1) {
        // Add a unique currentPath key to force unmounting of right panel
        // whenever the path changes.
        const newProps = {...child.props, key: this.props.currentPath};
        return React.cloneElement(child, newProps);
      }
      return child;
    });
    return <div className="main-container">{clonedChildren}</div>;
  }
}

export const Panels = connect(
  (state, ownProps) => {
    return {
      pageTitle: state.layout.pageTitle,
      currentPath: state.layout.currentPath
    };
  },
  {loadPageTitle}
)(_Panels);
