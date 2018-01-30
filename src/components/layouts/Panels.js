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

import React from "react";

/**
 * LeftPanel
 *
 * @param {object} props Takes a title and children elems.
 *
 * @return {ReactElement} The left panel element.
 */
export const LeftPanel = props => (
  <div className="left-panel">
    <h4 className="pt-dark left-panel-title">{props.title}</h4>
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
export const Panels = props => {
  if (props.children && props.children.length === 2) {
    // dynamically pass title
    let titledLeftPanel = React.cloneElement(props.children[0], {
      title: props.title
    });
    // nested object version.
    return (
      <div className="main-container">
        {titledLeftPanel}
        {props.children[1]}
      </div>
    );
  }
  // otherwise expect props leftPanel, title, and right Panel
  return (
    <div className="main-container">
      <div className="left-panel">
        <h4 className="pt-dark left-panel-title">{props.title}</h4>
        {props.leftPanel}
      </div>
      <div className="right-panel">{props.rightPanel}</div>
    </div>
  );
};
