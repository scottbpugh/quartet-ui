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
import {AddAuthentication} from "./components/Forms/AuthenticationForm";
import {AuthenticationList} from "./components/Lists/AuthenticationList";
import {EndpointsList} from "./components/Lists/EndpointsList";
import {EPCISCriteriaList} from "./components/Lists/EPCISCriteriaList";
import {AddEndpoint} from "./components/Forms/EndpointForm";
import {AddEPCISCriteria} from "./components/Forms/EPCISCriteriaForm";

const React = qu4rtet.require("react");
const {Route} = qu4rtet.require("react-router");

export default (() => {
  return [
    <Route
      key="addAuthentication"
      path="/output/:serverID/add-authentication"
      component={AddAuthentication}
    />,
    <Route
      key="addEndpoint"
      path="/output/:serverID/add-endpoint"
      component={AddEndpoint}
    />,
    <Route
      key="addEPCISCriteria"
      path="/output/:serverID/add-criteria"
      component={AddEPCISCriteria}
    />,
    <Route
      key="authentication"
      path="/output/:serverID/authentication"
      component={AuthenticationList}
    />,
    <Route
      key="endpointsList"
      path="/output/:serverID/endpoints"
      component={EndpointsList}
    />,
    <Route
      key="EPCISOutputCriteria"
      path="/output/:serverID/epcis-output-criteria"
      component={EPCISCriteriaList}
    />
  ];
})();
