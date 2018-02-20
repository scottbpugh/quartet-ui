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
import renderer from "react-test-renderer";
import {Panels, LeftPanel, RightPanel} from "./Panels";

it("renders attribute components correctly", () => {
  const panels = renderer
    .create(
      <Panels
        title="Test"
        leftPanel={<h1>Something</h1>}
        rightPanel={<h2>Something Else</h2>}
      />
    )
    .toJSON();
  expect(panels).toMatchSnapshot();
});

it("renders nested components correctly", () => {
  const panels = renderer
    .create(
      <Panels title="Test">
        <LeftPanel>
          <h1>Something</h1>
        </LeftPanel>
        <RightPanel>
          <h2>Something Else</h2>
        </RightPanel>
      </Panels>
    )
    .toJSON();
  expect(panels).toMatchSnapshot();
});

