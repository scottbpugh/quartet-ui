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
import {Card} from "@blueprintjs/core";
import {loadTradeItems} from "../../reducers/masterdata";

const TradeItemFieldForm = reduxForm({
  form: "tradeItemFieldForm"
})(PageForm);

class _AddTradeItemField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formStructure: []
    };
  }
  submitCallback() {
    // refresh list of trade items when field is saved...
    this.props.loadTradeItems(this.props.server);
  }
  render() {
    const tradeItem = this.props.tradeItems.find(tradeItem => {
      return (
        Number(tradeItem.id) === Number(this.props.match.params.tradeItemID)
      );
    });
    let tradeItemField = null;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.defaultValues
    ) {
      // to prepopulate with existing values.
      tradeItemField = this.props.location.state.defaultValues;
    }
    let editMode = tradeItemField ? true : false;
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.masterData.addTradeItemField" />
          ) : (
            <FormattedMessage id="plugins.masterData.editTradeItemField" />
          )
        }>
        <div className="large-cards-container">
          <Card className="form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.masterData.addTradeItemField" />
              ) : (
                <FormattedMessage id="plugins.masterData.editTradeItemField" />
              )}
            </h5>
            <TradeItemFieldForm
              edit={false}
              operationId={
                editMode
                  ? "masterdata_trade_item_fields_update"
                  : "masterdata_trade_item_fields_create"
              }
              objectName="tradeItemField"
              djangoPath="masterdata/trade-item-fields/"
              prepopulatedValues={[{name: "trade_item", value: tradeItem.id}]}
              existingValues={tradeItemField}
              submitCallback={this.submitCallback.bind(this)}
              redirectPath={`/masterdata/edit-trade-item/${
                this.props.server.serverID
              }/trade-item/${tradeItem.id}`}
              parameters={tradeItemField ? {id: tradeItemField.id} : {}}
              server={pluginRegistry.getServer(this.props.server.serverID)}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddTradeItemField = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      tradeItems:
        state.masterdata.servers[ownProps.match.params.serverID].tradeItems
    };
  },
  {loadTradeItems}
)(_AddTradeItemField);
