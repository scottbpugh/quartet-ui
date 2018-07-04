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
import "tools/mockStore"; // mock ipcRenderer, localStorage, ...
import renderer from "react-test-renderer";
import {SwitchTheme} from "./SwitchTheme";
import {TestWrapper} from "tools/mockStore";

it("renders correctly", () => {
  const props = {};
  const switchTheme = renderer
    .create(
      <TestWrapper>
        <SwitchTheme {...props} />
      </TestWrapper>
    )
    .toJSON();
  expect(switchTheme).toMatchSnapshot();
});
