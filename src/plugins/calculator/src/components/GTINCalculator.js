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
import {NDCtoGTIN14} from "../lib/ndcToGtin";
const React = qu4rtet.require("react");
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {Component} = React;
const {FormattedMessage} = qu4rtet.require("react-intl");
const {Card} = qu4rtet.require("@blueprintjs/core");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

export class GTINCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {ndc: null, GTINs: []};
  }
  calculateGtin = evt => {
    const gtins = Array(10)
      .fill()
      .map((_, i) => {
        let converted = NDCtoGTIN14(evt.target.value, i);
        if (converted.length === 14) {
          return {indicator: i, value: NDCtoGTIN14(evt.target.value, i)};
        } else {
          return {indicator: i, value: ""};
        }
      });
    this.setState({GTINs: gtins});
  };
  render() {
    return (
      <RightPanel
        key="GTINCalculatorPanel"
        title={
          <FormattedMessage id="plugins.gtinCalculator.GTINCalculatorTitle" />
        }>
        <div className="calculator-cards-container">
          <Card>
            <h5 className="bp3-heading">
              <FormattedMessage id="plugins.gtinCalculator.GTINCalculatorTitle" />
            </h5>
            <input
              className="pt-input pt-fill"
              onChange={this.calculateGtin}
              placeholder={pluginRegistry
                .getIntl()
                .formatMessage({id: "plugins.gtinCalculator.calcPlaceholder"})}
            />
          </Card>
          <Card>
            <h5 className="bp3-heading">
              <FormattedMessage id="plugins.gtinCalculator.GTINs" />
            </h5>
            <table
              className="pt-table pt-fill pt-striped"
              style={{width: "100%"}}>
              <tbody>
                {this.state.GTINs.map(item => {
                  return (
                    <tr>
                      <td style={{fontSize: "16px", fontWeight: "bold"}}>
                        <FormattedMessage
                          id="plugins.gtinCalculator.indicatorDigit"
                          values={{indicator: item.indicator}}
                        />
                      </td>
                      <td>{item.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      </RightPanel>
    );
  }
}
