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

import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Tree} from "@blueprintjs/core";
import PropTypes from "prop-types";
import {connect} from "react-redux";

export const NavItems = props => {
  return props.nr[props.server.serverID].pools.map(pool => {
    return {
      key: pool.machine_name,
      label: pool.readable_name,
      path: `/number-range/region-detail/${props.server.serverID}/${
        pool.machine_name
      }`
    };
  });
};
