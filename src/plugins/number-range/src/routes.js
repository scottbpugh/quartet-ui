// Copyright (c) 2018 Serial Lab
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
import {PoolList} from "./components/PoolList";
import {RegionDetail} from "./components/RegionDetail";

/**
 * Default - Returns an array of routes to be appended to main Switch.
 *
 * @return {array} An array of routes to be appended to main app.
 */
export default (() => {
  return [
    <Route path="/number-range/pools" component={PoolList} />,
    <Route
      path="/number-range/region-detail/:serverID/:pool"
      component={RegionDetail}
    />
  ];
})();
