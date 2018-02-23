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
import {switchTheme} from "reducers/layout";

const themes = [
  {name: "Light Panel", id: "light"},
  {name: "Dark Theme", id: "dark"},
  {name: "Contrasted Theme", id: "contrasted"},
  {name: "Dark Brown", id: "dark-brown"},
  {name: "Am I in Heaven?", id: "heaven-light"}
];

class _SwitchTheme extends Component {
  render() {
    const {currentTheme} = this.props;
    return (
      <div className="pt-select">
        <select
          value={currentTheme}
          onChange={e => this.props.switchTheme(e.target.value)}>
          {themes.map(theme => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export const SwitchTheme = connect(
  state => ({currentTheme: state.layout.theme}),
  {switchTheme}
)(_SwitchTheme);
