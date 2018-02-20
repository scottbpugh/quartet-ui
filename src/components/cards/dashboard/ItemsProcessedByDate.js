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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  {name: "October", Commissioned: 4000, Shipped: 2400, amt: 2400},
  {name: "November", Commissioned: 3000, Shipped: 1398, amt: 2210},
  {name: "December", Commissioned: 2000, Shipped: 9800, amt: 2290},
  {name: "January", Commissioned: 2780, Shipped: 3908, amt: 2000}
];

export default props => {
  return (
    <ResponsiveContainer width="90%" aspect={4.0 / 3.0}>
      <LineChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Commissioned"
          stroke="#8884d8"
          activeDot={{r: 8}}
        />
        <Line type="monotone" dataKey="Shipped" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};
