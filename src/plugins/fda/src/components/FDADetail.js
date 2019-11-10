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
const {FormattedMessage} = qu4rtet.require("react-intl");
const {Card, Button, ControlGroup, InputGroup, Tag} = qu4rtet.require(
  "@blueprintjs/core"
);
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {connect} = qu4rtet.require("react-redux");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

const uuidv1 = qu4rtet.require("uuid/v1");

const yieldDataPairRowIfSet = (key, value) => {
  let improvedKey = key.replace(/_/g, " ").replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  let val = value;
  if (Array.isArray(value)) {
    val = value.join(", ");
  }
  if (typeof val === "string" && val.startsWith("<table")) {
    // don't show tables.
    return null;
  }
  if (key && value) {
    return (
      <tr>
        <td>{improvedKey}</td>
        <td>{val}</td>
      </tr>
    );
  }
  return null;
};

class _FDADetail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {openfda} = this.props.fdaItem;
    return (
      <RightPanel title={<FormattedMessage id="plugins.fda.FDALookup" />}>
        <div className="twin-cards-container" style={{position: "relative"}}>
          <Card className="pt-elevation-4">
            <h5>
              {openfda.brand_name}
              <button
                onClick={e => {
                  this.props.history.push(
                    `/fda/${this.props.server.serverID}/map-trade-items/${
                      this.props.match.params.fdaItem
                    }`
                  );
                }}
                className="pt-button pt-intent-primary add-incard-button">
                <FormattedMessage id="plugins.fda.generateTradeItem" />
              </button>
            </h5>
            <table
              style={{paddingTop: "60px"}}
              className="pt-table data-pair-table pt-bordered pt-striped">
              <tbody>
                {Object.keys(openfda).map(item => {
                  return yieldDataPairRowIfSet(item, openfda[item]);
                })}
                {yieldDataPairRowIfSet(
                  "description",
                  this.props.fdaItem.description
                )}
                {Object.keys(this.props.fdaItem).map(item => {
                  if (item === "openfda") {
                    return null;
                  }
                  return yieldDataPairRowIfSet(item, this.props.fdaItem[item]);
                })}
              </tbody>
            </table>
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const FDADetail = connect((state, ownProps) => {
  const isServerSet = () => {
    return (
      state.fda.servers && state.fda.servers[ownProps.match.params.serverID]
    );
  };
  let fdaServer = isServerSet()
    ? state.fda.servers[ownProps.match.params.serverID]
    : null;
  return {
    server: state.serversettings.servers[ownProps.match.params.serverID],
    fdaItem: fdaServer ? fdaServer.fdaItems[ownProps.match.params.fdaItem] : {}
  };
}, {})(_FDADetail);
