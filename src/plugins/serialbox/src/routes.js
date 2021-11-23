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
import {PoolList} from "./components/PoolList";
import {PoolsList} from "./components/Lists/PoolsList";
import {RegionDetail} from "./components/RegionDetail";
import {AddRegion} from "./components/AddRegion";
import {AddRandomizedRegion} from "./components/AddRandomizedRegion";
import {AddListBasedRegion} from "./components/AddListBasedRegion";
import {AddPool} from "./components/AddPool";
import PoolForm from "./components/PoolForm";
import {AddResponseRule} from "./components/AddResponseRule";

const React = qu4rtet.require("react");
const {Route} = qu4rtet.require("react-router");

/**
 * Default - Returns an array of routes to be appended to main Switch.
 *
 * @return {array} An array of routes to be appended to main app.
 */
export default (() => {
  return [
    <Route
      key="poolList"
      path="/number-range/pools/:serverID"
      component={PoolsList}
    />,
    <Route
      key="regionDetail"
      path="/number-range/region-detail/:serverID/:pool"
      component={RegionDetail}
    />,
    <Route
      key="addRegion"
      path="/number-range/add-region/:serverID/:pool"
      component={AddRegion}
    />,
    <Route
      key="addRandomRegion"
      path="/number-range/add-randomized-region/:serverID/:pool"
      component={AddRandomizedRegion}
    />,
    <Route
      key="addListBasedRegion"
      path="/number-range/add-list-based-region/:serverID/:pool"
      component={AddListBasedRegion}
    />,
    <Route
      key="editRegion"
      path="/number-range/edit-region/:serverID/:pool"
      component={AddRegion}
    />,
    <Route
      key="editRandomRegion"
      path="/number-range/edit-randomized-region/:serverID/:pool"
      component={AddRandomizedRegion}
    />,
    <Route
      key="editListBasedRegion"
      path="/number-range/edit-list-based-region/:serverID/:pool"
      component={AddListBasedRegion}
    />,
    <Route
      key="addPool"
      path="/number-range/add-pool/:serverID/:poolName?"
      component={AddPool}
    />,
    <Route
      key="editPool"
      path="/number-range/edit-pool/:serverID/:poolName?"
      component={AddPool}
    />,
    <Route
      key="addResponseRule"
      path="/number-range/add-response-rule/:serverID/pool-id/:poolID"
      component={AddResponseRule}
    />
  ];
})();
