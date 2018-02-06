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

import messages from "../../../messages";
import {switchLocale} from "../../../reducers/locales";

class _SwitchLocale extends Component {
  render() {
    let currentLocale = this.props.currentLocale;
    return (
      <div className="pt-select">
        <select
          value={currentLocale}
          onChange={e => this.props.switchLocale(e.target.value)}>
          {Object.keys(messages).map(locale => (
            <option key={locale}>{locale}</option>
          ))}
        </select>
      </div>
    );
  }
}

export var SwitchLocale = connect(
  state => ({
    currentLocale: state.intl.locale
  }),
  {switchLocale}
)(_SwitchLocale);
