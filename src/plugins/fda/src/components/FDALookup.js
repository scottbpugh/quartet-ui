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
import {searchFDA} from "../reducers/fda";
const React = qu4rtet.require("react");
const {Component} = React;
const {FormattedMessage} = qu4rtet.require("react-intl");
const {Card, Button, ControlGroup, InputGroup} = qu4rtet.require(
  "@blueprintjs/core"
);
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {connect} = qu4rtet.require("react-redux");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

const uuidv1 = qu4rtet.require("uuid/v1");

const yieldDataPairRowIfSet = (key, value) => {
  if (key && value) {
    return (
      <tr>
        <td>
          <FormattedMessage id={key} />
        </td>
        <td>{value}</td>
      </tr>
    );
  }
  return null;
};

class _FDALookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lookup: null,
      searchField: "openfda.product_ndc.exact",
      items: [],
      total: 0,
      skip: 0
    };
  }
  goToDetail = (item, index) => {
    this.props.history.push(
      `/fda/${this.props.server.serverID}/detail/${index}`
    );
  };
  componentDidMount() {
    // TODO: Revist this code. Try to setState elsewhere
    this.setState({
      lookup: this.props.fdaLookup || null,
      searchField: this.props.fdaSearchField || "openfda.product_ndc.exact",
      items: this.props.fdaItems || [],
      total: this.props.fdaTotal || 0,
      skip: this.props.fdaSkip || 0
    });
  }
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.fdaItems) !== JSON.stringify(nextProps.fdaItems)
    ) {
      this.setState({
        items: nextProps.fdaItems || [],
        total: nextProps.fdaTotal || 0,
        skip: nextProps.fdaSkip || 0
      });
    }
  }
  next = () => {
    let skip =
      this.state.skip + 20 > this.state.total
        ? this.state.total
        : this.state.skip + 20;
    this.setState({skip: skip}, () => {
      this.searchFDA(null, skip);
    });
  };
  previous = () => {
    let skip = this.state.skip - 20 >= 0 ? this.state.skip - 20 : 0;
    this.setState({skip: skip}, () => {
      this.searchFDA(null, skip);
    });
  };
  searchFDA = (evt, skip = 0) => {
    if (evt) {
      evt.preventDefault();
    }
    this.props.searchFDA(
      this.props.server,
      this.state.searchField,
      this.state.lookup,
      skip
    );
  };
  handleFieldChange = evt => {
    this.setState({searchField: evt.target.value});
  };
  render() {
    return (
      <RightPanel title={<FormattedMessage id="plugins.fda.FDALookup" />}>
        <form onSubmit={this.searchFDA}>
          <div
            className="pt-control-group"
            style={{marginLeft: "10%", marginTop: "30px"}}>
            <div className="pt-select">
              <select
                value={this.state.searchField}
                onChange={this.handleFieldChange}>
                <option selected>Choose a field</option>
                <option value="openfda.manufacturer_name">
                  {pluginRegistry
                    .getIntl()
                    .formatMessage({id: "plugins.fda.manufacturerName"})}
                </option>
                <option value="openfda.brand_name">
                  {pluginRegistry
                    .getIntl()
                    .formatMessage({id: "plugins.fda.brandName"})}
                </option>
                <option value="openfda.generic_name">
                  {pluginRegistry
                    .getIntl()
                    .formatMessage({id: "plugins.fda.genericName"})}
                </option>
                <option value="openfda.package_ndc.exact">
                  {pluginRegistry
                    .getIntl()
                    .formatMessage({id: "plugins.fda.packageNdc"})}
                </option>
                <option value="openfda.product_ndc.exact">
                  {pluginRegistry
                    .getIntl()
                    .formatMessage({id: "plugins.fda.productNdc"})}
                </option>
              </select>
            </div>
            <input
              onChange={e => {
                this.setState({lookup: e.target.value});
              }}
              className="pt-input"
              style={{width: "60%"}}
              defaultValue={this.state.lookup}
            />
            <button className="pt-button" type="submit">
              search
            </button>
          </div>
        </form>
        <div
          className="table-control"
          style={{marginTop: "40px", marginLeft: "20px", marginRight: "20px"}}>
          <div className="pagination-control">
            <div>
              <Button
                disabled={this.state.skip < 1}
                onClick={this.previous.bind(this)}>
                <FormattedMessage id="plugins.fda.previous" />
              </Button>{" "}
              |{" "}
              <Button
                disabled={this.state.skip >= this.state.total - 20}
                onClick={this.next.bind(this)}>
                <FormattedMessage id="plugins.fda.next" />
              </Button>
            </div>
          </div>
          <div>
            <div className="label-info-display">
              <FormattedMessage
                id="app.common.entriesTotal"
                values={{entriesCount: this.state.total}}
              />
            </div>
          </div>
        </div>
        <div className="auto-cards-container" style={{margin: "40px 0"}}>
          {this.state.items.map((item, index) => {
            let productNdcs = "";
            try {
              productNdcs = item["openfda"]["product_ndc"];
              if (Array.isArray(productNdcs)) {
                productNdcs = productNdcs.join(", ");
              }
            } catch (e) {
              // apparently having an issue with product_ndc.
              console.log(e);
            }
            if (item["openfda"]["product_ndc"])
              return (
                <Card
                  onClick={this.goToDetail.bind(this, item, index)}
                  className="region-detail pt-elevation-2 pt-interactive"
                  key={uuidv1()}>
                  <h5 className="bp3-heading">{item.openfda ? item.openfda.brand_name : null} </h5>
                  <table className="pt-table" style={{width: "100%"}}>
                    <tbody>
                      {yieldDataPairRowIfSet(
                        "plugins.fda.productNdc",
                        productNdcs
                      )}
                      {yieldDataPairRowIfSet(
                        "plugins.fda.genericName",
                        item["openfda"]["generic_name"]
                      )}
                      {yieldDataPairRowIfSet(
                        "plugins.fda.brandName",
                        item["openfda"]["brand_name"]
                      )}
                      {yieldDataPairRowIfSet(
                        "plugins.fda.manufacturerName",
                        item["openfda"]["manufacturer_name"]
                      )}
                    </tbody>
                  </table>
                </Card>
              );
          })}
        </div>
      </RightPanel>
    );
  }
}

export const FDALookup = connect(
  (state, ownProps) => {
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
      fdaItems: fdaServer ? fdaServer.fdaItems : [],
      fdaSkip: fdaServer ? fdaServer.fdaSkip : 0,
      fdaTotal: fdaServer ? fdaServer.fdaTotal : 0,
      fdaSearchField: fdaServer ? fdaServer.fdaSearchField : null,
      fdaLookup: fdaServer ? fdaServer.fdaLookup : null
    };
  },
  {searchFDA}
)(_FDALookup);
