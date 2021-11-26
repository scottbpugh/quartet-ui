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
import {ExampleScreen} from "./components/Lists/ExampleScreen";
import {FDALookup} from "./components/FDALookup";
import {FDADetail} from "./components/FDADetail";
import {MapTradeItems} from "./components/MapTradeItems";
const React = qu4rtet.require("react");
const {Route} = qu4rtet.require("react-router");

export default (() => {
  return [
    <Route
      key="FDALookup"
      path="/fda/:serverID/lookup"
      component={FDALookup}
    />,
    <Route
      key="FDADetail"
      path="/fda/:serverID/detail/:fdaItem"
      component={FDADetail}
    />,
    <Route
      key="MapToTradeItems"
      path="/fda/:serverID/map-trade-items/:fdaItem"
      component={MapTradeItems}
    />
  ];
})();
