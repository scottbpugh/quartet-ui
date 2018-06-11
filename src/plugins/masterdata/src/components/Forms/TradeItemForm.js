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
import {FormattedMessage} from "react-intl";
import {reduxForm} from "redux-form";
import {pluginRegistry} from "plugins/pluginRegistration";
import PageForm from "components/elements/PageForm";
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {Card, Button, ButtonGroup} from "@blueprintjs/core";
import {deleteTradeItemField} from "../../reducers/masterdata";

const TradeItemForm = reduxForm({
  form: "tradeItemForm"
})(PageForm);

class _AddTradeItem extends Component {
  constructor(props) {
    super(props);
    let tradeItem = this.getTradeItem(this.props.tradeItems, this.props.match);
    this.state = {
      tradeItem: tradeItem
    };
  }
  componentWillReceiveProps(nextProps) {
    let tradeItem = this.getTradeItem(nextProps.tradeItems, nextProps.match);
    this.setState({
      tradeItem: tradeItem
    });
  }
  editTradeItemField(field) {
    const {server} = this.props;
    let tradeItem =
      this.state.tradeItem ||
      this.getTradeItem(this.props.tradeItems, this.props.match);
    if (tradeItem) {
      this.props.history.push({
        pathname: `/masterdata/edit-trade-item-field/${
          server.serverID
        }/trade-item/${tradeItem.id}/trade-item-field/${field.id}`,
        state: {defaultValues: field, edit: true}
      });
    }
  }
  deleteTradeItemField(field) {
    this.props.deleteTradeItemField(this.props.server, field);
  }
  getTradeItem(tradeItems = null, match = null) {
    if (tradeItems && match) {
      return tradeItems.find(tradeItem => {
        return Number(tradeItem.id) === Number(match.params.tradeItemID);
      });
    } else if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      return this.props.location.state.defaultValues;
    }
    return null;
  }
  render() {
    let tradeItem = this.state.tradeItem;
    let editMode = this.state.tradeItem ? true : false;
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.masterData.addTradeItem" />
          ) : (
            <FormattedMessage id="plugins.masterData.editTradeItem" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.masterData.addTradeItem" />
              ) : (
                <FormattedMessage id="plugins.masterData.editTradeItem" />
              )}
            </h5>
            <TradeItemForm
              edit={false}
              operationId={
                editMode
                  ? "masterdata_trade_items_update"
                  : "masterdata_trade_items_create"
              }
              objectName="tradeItem"
              djangoPath="masterdata/trade-items/"
              existingValues={tradeItem}
              redirectPath={`/masterdata/trade-items/${
                this.props.server.serverID
              }`}
              parameters={tradeItem ? {id: tradeItem.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
          {editMode ? (
            <Card className="pt-elevation-4 form-card">
              <h5>
                <button
                  className="pt-button right-aligned-elem pt-interactive pt-intent-primary"
                  onClick={e => {
                    this.props.history.push(
                      `/masterdata/add-trade-item-field/${
                        this.props.server.serverID
                      }/trade-item/${tradeItem.id}`
                    );
                  }}>
                  <FormattedMessage id="plugins.masterData.addTradeItemField" />
                </button>
                <FormattedMessage id="plugins.masterData.tradeItemFields" />
              </h5>

              {Array.isArray(tradeItem.tradeitemfield_set) &&
              tradeItem.tradeitemfield_set.length > 0 ? (
                <table className="pt-table pt-interactive pt-bordered pt-striped">
                  <thead>
                    <th>
                      <FormattedMessage
                        id="plugins.masterData.name"
                        defaultMessage="Name"
                      />
                    </th>
                    <th>
                      {" "}
                      <FormattedMessage
                        id="plugins.masterData.value"
                        defaultMessage="Value"
                      />
                    </th>
                    <th> </th>
                  </thead>
                  <tbody>
                    {tradeItem.tradeitemfield_set.map(field => {
                      return (
                        <tr key={field.id}>
                          <td>{field.name}</td>
                          <td>{field.value}</td>
                          <td style={{width: "80px"}}>
                            <ButtonGroup minimal={true} small={true}>
                              <Button
                                small={true}
                                iconName="edit"
                                onClick={this.editTradeItemField.bind(
                                  this,
                                  field
                                )}
                              />
                              <Button
                                small={true}
                                iconName="trash"
                                onClick={this.deleteTradeItemField.bind(
                                  this,
                                  field
                                )}
                              />
                            </ButtonGroup>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : null}
            </Card>
          ) : null}
        </div>
      </RightPanel>
    );
  }
}

export const AddTradeItem = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      tradeItems:
        state.masterdata.servers[ownProps.match.params.serverID].tradeItems
    };
  },
  {deleteTradeItemField}
)(_AddTradeItem);
