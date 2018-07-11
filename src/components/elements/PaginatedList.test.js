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
import "tools/mockStore"; // mock ipcRenderer, localStorage, ...
import renderer from "react-test-renderer";
import {TestWrapper} from "tools/mockStore";
import Enzyme, {mount, shallow} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinon from "sinon";
import toJson from "enzyme-to-json";
import * as serverAPI from "lib/server-api";
import {PaginatedList} from "./PaginatedList";

const TestTableHeader = props => (
  <thead>
    <th>
A Single Value
    </th>
  </thead>
);

const TestEntry = props => (
  <tr key={props.entry.key}>
    <td>
      {props.entry.name}
    </td>
  </tr>
);

it("renders correctly", () => {
  const list = renderer
    .create(
      <TestWrapper>
        <PaginatedList
          listTitle="Hello Test"
          loadEntries={() => {}}
          server={{serverID: "blabla"}}
          entries={[{name: "Hello World", key: "hello"}]}
          count={0}
          next={0}
          tableHeaderClass={TestTableHeader}
          entryClass={TestEntry}
        />
      </TestWrapper>
    )
    .toJSON();
  expect(list).toMatchSnapshot();
});
