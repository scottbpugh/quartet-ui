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

// Example of an independent state-based component.
class LatestGTINs extends Component {
  counter = 1;
  state = {
    items: []
  };
  componentDidMount() {
    this.updateMockEPC();
  }
  updateMockEPC = () => {
    setInterval(() => {
      let vals = [
        {
          epc: `urn:epc:id:sgtin:1234567.312345.${this.counter++}`,
          latestBizStep: "commissioning"
        },
        {
          epc: `urn:epc:id:sgtin:1234567.312345.${this.counter++}`,
          latestBizStep: "commissioning"
        },
        {
          epc: `urn:epc:id:sgtin:1234567.312345.${this.counter++}`,
          latestBizStep: "commissioning"
        },
        {
          epc: `urn:epc:id:sgtin:1234567.312345.${this.counter++}`,
          latestBizStep: "commissioning"
        },
        {
          epc: `urn:epc:id:sgtin:1234567.312345.${this.counter++}`,
          latestBizStep: "commissioning"
        },
        {
          epc: `urn:epc:id:sgtin:1234567.312345.${this.counter++}`,
          latestBizStep: "commissioning"
        }
      ];
      this.setState({
        items: vals
      });
    }, 200);
  };
  render() {
    let list = [];
    return (
      <table className="pt-table pt-striped">
        <thead>
          <tr>
            <th>EPC URN</th>
            <th>Business Step</th>
          </tr>
        </thead>
        <tbody>
          {this.state.items.map(elem => {
            return (
              <tr>
                <td>{elem.epc}</td>
                <td>{elem.latestBizStep}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default LatestGTINs;
