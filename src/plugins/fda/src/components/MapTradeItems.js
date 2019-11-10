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
import {NDCtoGTIN14, NDCToCompanyPrefix, getNDCPattern} from "../lib/ndcToGtin";
const React = qu4rtet.require("react");
const {Component} = React;
const {FormattedMessage} = qu4rtet.require("react-intl");
const {
  Card,
  Button,
  ControlGroup,
  InputGroup,
  Tag,
  FormGroup,
  Switch
} = qu4rtet.require("@blueprintjs/core");
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {connect} = qu4rtet.require("react-redux");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const uuidv1 = qu4rtet.require("uuid/v1");
const {showMessage} = qu4rtet.require("./lib/message");

const yieldDataPairRowIfSet = (key, value) => {
  let improvedKey = key.replace(/_/g, " ").replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  let val = value;
  if (Array.isArray(value)) {
    val = value.join(", ");
  }
  if (val.startsWith("<table")) {
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

class _MapTradeItems extends Component {
  constructor(props) {
    super(props);
    this.state = {items: []};
  }
  enableToggle = index => {
    let items = [...this.state.items];
    items[index].enabled = !items[index].enabled;
    this.setState({items});
  };
  selectIndicator = (index, evt) => {
    let items = [...this.state.items];
    items[index].indicatorDigit = Number(evt.target.value);
    items[index].gtin14 = NDCtoGTIN14(
      items[index].packageNDC,
      items[index].indicatorDigit
    );
    this.setState({items});
  };
  componentDidMount() {
    this.setState({
      items: this.props.fdaItem.openfda.package_ndc.map(item => {
        return {
          packageNDC: item,
          enabled: true,
          gtin14: NDCtoGTIN14(item, 0),
          indicatorDigit: 0
        };
      })
    });
  }
  checkValIsSet = val => {
    return Array.isArray(val) && val.length > 0;
  };

  existingCompanyMatch = async (manufacturerName, ndc) => {
    let serverObj = await pluginRegistry.getServer(this.props.server);
    let companyPrefix = NDCToCompanyPrefix(ndc);
    let companyPrefixSearch = null;
    try {
      companyPrefixSearch = await serverObj.fetchPageList(
        "masterdata_companies_list",
        {search: companyPrefix}
      );
    } catch (error) {
      // server seems not to pull list correctly.
      showMessage({
        id: "app.common.mainError",
        values: {msg: error.message},
        type: "warning"
      });
      return null;
    }
    if (companyPrefixSearch && companyPrefixSearch.count > 0) {
      for (let company of companyPrefixSearch.results) {
        if (company.gs1_company_prefix === companyPrefix) {
          // we have a perfect match, return id.
          return company.id;
        }
      }
    }
    // No perfect match. Don't use any of the companies found.
    return null;
  };

  getSetCompany = async (manufacturerName, ndc) => {
    let serverObj = await pluginRegistry.getServer(this.props.server);
    let existingCompanyId = await this.existingCompanyMatch(
      manufacturerName,
      ndc
    );
    if (existingCompanyId) {
      // should match the company prefix, the company name, to be existing.
      return existingCompanyId;
    }
    let client = await serverObj.getClient();
    try {
      let result = await client.execute({
        operationId: "masterdata_companies_create",
        parameters: {
          data: {
            name: manufacturerName,
            gs1_company_prefix: NDCToCompanyPrefix(ndc) || "unknown"
          }
        }
      });
      if (result.ok) {
        // we got a match post create.
        return result.body.id;
      } else {
        // something went wrong.
        showMessage({
          id: "app.common.mainError",
          values: {msg: "An error occurred while creating company"},
          type: "warning"
        });
      }
    } catch (error) {
      // create request didn't work.
      showMessage({
        id: "app.common.mainError",
        values: {msg: error.message},
        type: "warning"
      });
    }
  };

  capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  formatError = error => {
    try {
      let formattedMessage = Object.keys(error.response.body)
        .map(key => {
          return `${this.capitalize(
            key.replace("_", " ")
          )}: ${error.response.body[key].map(innerMsg => {
            return ` ${innerMsg}\n`;
          })}`;
        })
        .join(" ");
      showMessage({
        msg: formattedMessage,
        type: "warning",
        expires_in: 1000
      });
    } catch (e) {
      // ignore an error formatting an error.
      console.log("Error occurred while formatting error msg", e);
    }
  };

  generateTradeItems = async evt => {
    evt.preventDefault();
    if (
      !this.props.fdaItem.openfda.manufacturer_name &&
      !this.state.items[0].packageNDC
    ) {
      showMessage({
        id: "app.common.mainError",
        values: {msg: "Missing Manufacturer and NDC data"},
        type: "warning"
      });
      return;
    }
    let client = await pluginRegistry.getServer(this.props.server).getClient();
    let company = await this.getSetCompany(
      this.props.fdaItem.openfda.manufacturer_name[0],
      this.state.items[0].packageNDC
    );
    this.state.items.forEach((item, index) => {
      let submitValues = {company: company};
      if (item.enabled) {
        if (this.checkValIsSet(this.props.fdaItem.description)) {
          submitValues.trade_item_description = this.props.fdaItem.description[0]
            .replace("DESCRIPTION", "")
            .substring(0, 199);
        }
        if (this.checkValIsSet(this.props.fdaItem.openfda.manufacturer_name)) {
          submitValues.manufacturer_name = this.props.fdaItem.openfda.manufacturer_name[0];
        }
        submitValues.GTIN14 = item.gtin14;
        submitValues.NDC = item.packageNDC;
        submitValues.NDC_pattern = getNDCPattern(item.packageNDC);
        if (this.checkValIsSet(this.props.fdaItem.openfda.generic_name)) {
          submitValues.functional_name = this.props.fdaItem.openfda.generic_name[0];
        }
        if (this.checkValIsSet(this.props.fdaItem.openfda.brand_name)) {
          submitValues.regulated_product_name = this.props.fdaItem.openfda.brand_name[0];
        }
        setTimeout(() => {
          client
            .execute({
              operationId: "masterdata_trade_items_create",
              parameters: {data: submitValues}
            })
            .then(result => {
              if (result.ok) {
                showMessage({
                  id: "app.common.objectCreatedSuccessfully",
                  values: {objectName: `GTIN ${submitValues.GTIN14}`},
                  type: "success"
                });
              } else {
                showMessage({
                  id: "app.common.mainError",
                  values: {msg: "An error occurred while creating trade item"},
                  type: "warning"
                });
              }
            })
            .catch(error => {
              if (
                error.status === 400 &&
                error.response &&
                error.response.body
              ) {
                if (
                  typeof error.response.body === "object" &&
                  error.response.body !== null
                ) {
                  this.formatError(error);
                }
              } else {
                showMessage({
                  id: "app.common.mainError",
                  values: {msg: error.message},
                  type: "warning"
                });
              }
            });
        }, 200 * index);
      }
    });
  };

  render() {
    const {openfda} = this.props.fdaItem;
    let intl = pluginRegistry.getIntl();
    return (
      <RightPanel title={<FormattedMessage id="plugins.fda.FDALookup" />}>
        <div className="twin-cards-container" style={{position: "relative"}}>
          <Card className="pt-elevation-4">
            <h5>{openfda.brand_name}</h5>
            <form
              onSubmit={this.generateTradeItems}
              style={{marginTop: "30px"}}
              className="pt-form">
              {this.state.items.map((item, index) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      borderBottom: "1px solid #111",
                      padding: "20px"
                    }}>
                    <Switch
                      checked={item.enabled}
                      label={intl.formatMessage({
                        id: "plugins.fda.generateTradeItem"
                      })}
                      onChange={this.enableToggle.bind(this, index)}
                    />
                    <FormGroup
                      helperText={intl.formatMessage({
                        id: "plugins.fda.fdaProvidedNDC"
                      })}
                      label={`NDC #${index + 1}`}
                      labelFor="text-input"
                      required={true}>
                      <input
                        id="text-input"
                        disabled={true}
                        defaultValue={item.packageNDC}
                        className="pt-input"
                      />
                    </FormGroup>
                    <FormGroup
                      helperText={intl.formatMessage({
                        id: "plugins.fda.indicatorDigit"
                      })}
                      label={intl.formatMessage({
                        id: "plugins.fda.indicatorDigit"
                      })}
                      labelFor="text-input">
                      <div class="pt-select">
                        <select
                          value={item.indicatorDigit}
                          onChange={this.selectIndicator.bind(this, index)}>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>
                      </div>
                    </FormGroup>
                    <FormGroup helperText="GTIN 14" label="GTIN 14">
                      <span style={{fontSize: "16px"}}>{item.gtin14}</span>
                    </FormGroup>
                  </div>
                );
              })}
              <Button
                type="submit"
                style={{marginTop: "30px"}}
                className="pt-intent-primary">
                <FormattedMessage id="plugins.fda.generateTradeItems" />
              </Button>
            </form>
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const MapTradeItems = connect((state, ownProps) => {
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
}, {})(_MapTradeItems);
