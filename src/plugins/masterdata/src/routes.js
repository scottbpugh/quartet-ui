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
import React from "react";
import {Route} from "react-router";
import {AddLocation} from "./components/Forms/LocationForm";
import {AddCompany} from "./components/Forms/CompanyForm";
import {AddTradeItem} from "./components/Forms/TradeItemForm";
import {LocationsList} from "./components/Lists/LocationsList";
import {CompaniesList} from "./components/Lists/CompaniesListTable";
import {TradeItemsList} from "./components/Lists/TradeItemsList";
import {AddTradeItemField} from "./components/Forms/TradeItemFieldForm";

export default (() => {
  return [
    <Route
      key="locationList"
      path="/masterdata/locations/:serverID"
      component={LocationsList}
    />,
    <Route
      key="companyList"
      path="/masterdata/companies/:serverID"
      component={CompaniesList}
    />,
    <Route
      key="tradeItemList"
      path="/masterdata/trade-items/:serverID"
      component={TradeItemsList}
    />,
    <Route
      key="addLocation"
      path="/masterdata/add-location/:serverID"
      component={AddLocation}
    />,
    <Route
      key="addCompany"
      path="/masterdata/add-company/:serverID"
      component={AddCompany}
    />,
    <Route
      key="addTradeItem"
      path="/masterdata/add-trade-item/:serverID"
      component={AddTradeItem}
    />,
    <Route
      key="editLocation"
      path="/masterdata/edit-location/:serverID/location/:locationID"
      component={AddLocation}
    />,
    <Route
      key="editCompany"
      path="/masterdata/edit-company/:serverID/company/:companyID"
      component={AddCompany}
    />,
    <Route
      key="addTradeItem"
      path="/masterdata/edit-trade-item/:serverID/trade-item/:tradeItemID"
      component={AddTradeItem}
    />,
    <Route
      key="addTradeItemField"
      path="/masterdata/add-trade-item-field/:serverID/trade-item/:tradeItemID"
      component={AddTradeItemField}
    />,
    <Route
      key="editTradeItemField"
      path="/masterdata/edit-trade-item-field/:serverID/trade-item/:tradeItemID"
      component={AddTradeItemField}
    />
  ];
})();
