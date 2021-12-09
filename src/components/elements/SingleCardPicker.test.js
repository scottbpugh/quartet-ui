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
import {SingleCardPicker} from "./SingleCardPicker";

it("renders correctly", () => {
  const TestEntry = props => {
    const updateFieldVal = entry => {
      // trigger a redux form field value change
      props.changeValue(entry);
    };
    return (
      <div
        key={props.entry.id}
        onClick={updateFieldVal.bind(this, props.entry)}
      >
        <h5 className="bp3-heading">
          {props.entry.name}
        </h5>
        <ul className="picker-data-list">
          <li>
            {props.entry.GLN13}
          </li>
          {props.entry.city ? (
            <li>
              {props.entry.city}
            </li>
          ) : null}
          {props.entry.country ? (
            <li>
              {props.entry.country}
            </li>
          ) : null}
        </ul>
      </div>
    );
  };
  const CardPicker = renderer
    .create(
      <TestWrapper>
        <SingleCardPicker
          listTitle="Hello Test"
          changeValue={() => {}}
          loadEntries={() => {}}
          server={{serverID: "aServerID"}}
          entries={[
            {id: "anyID", GLN13: "anyvalue", city: "Falaise", country: "France"}
          ]}
          count={0}
          next={0}
          entryClass={TestEntry}
        />
      </TestWrapper>
    )
    .toJSON();
  expect(CardPicker).toMatchSnapshot();
});
