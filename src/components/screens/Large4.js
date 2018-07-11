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

export class Large4 extends Component {
  render() {
    return (
      <div
        style={{
          width: "50%",
          height: "100%",
          position: "fixed",
          opacity: "0.06",
          zIndex: "-1",
          right: "0"
        }}
      >
        <svg version="1.1" id="letter-4-bck" viewBox="0 0 17 17">
          <g transform="translate(1, 0)">
            <path
              className="letter-4-path"
              d="M 9.2765539,0.02422728 1.8859289,12.825008 h 8.7402351 v 3.189453 h 3.169921 v -3.189453 h 2.179688 V 9.6550867 H 13.796085 V 0.02422728 Z M 10.626164,3.3640711 V 9.6550867 H 6.6554602 Z m -9.4296882,10.6503899 -1.18164057,2 H 3.1964758 l 1.1796875,-2 z"
            />
          </g>
        </svg>
      </div>
    );
  }
}
window.qu4rtet.exports("components/screens/Large4.js", this);
