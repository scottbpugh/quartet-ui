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

const React = qu4rtet.require("react");
const {Component} = React;
const {withRouter} = qu4rtet.require("react-router-dom");
import {Button} from '@blueprintjs/core';

class _CalculatorButton extends Component {
  static get PLUGIN_COMPONENT_NAME() {
    return "GTINCalculatorButton";
  }
  render() {
    return (
      <Button
          border={false}
        className="pt-button"
        icon="calculator"
        onClick={e => {
          this.props.history.push("/calculator/gtin");
        }}
      />
    );
  }
}

export const CalculatorButton = withRouter(_CalculatorButton);
