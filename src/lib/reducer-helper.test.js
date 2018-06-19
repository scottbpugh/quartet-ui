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
import {setServerState} from "./reducer-helper";

it("setServerState returns the proper structure when server data is not yet populated", () => {
  let currentState = {}; // no servers in there.
  let newState = setServerState(currentState, "random-server-id", {
    myArray: ["hello", "hello"]
  });
  expect(newState).toMatchSnapshot();
});

it("setServerState returns the proper structure when server data populated and other keys should remain", () => {
  let currentState = {}; // no servers in there.
  let newState = setServerState(currentState, "random-server-id", {
    myArray: ["hello", "hello"]
  });
  let anotherState = setServerState(newState, "random-server-id", {
    somethingElse: ["hi", "hi"]
  });
  expect(newState).toMatchSnapshot();
  expect(anotherState).toMatchSnapshot();
});

it("setServerState returns the proper structure with array replaced for same key", () => {
  let currentState = {}; // no servers in there.
  let newState = setServerState(currentState, "random-server-id", {
    myArray: ["hello", "hello"]
  });
  let anotherState = setServerState(newState, "random-server-id", {
    somethingElse: ["hi", "hi"]
  });
  let modifiedMyArray = setServerState(anotherState, "random-server-id", {
    myArray: {this: {is: {something: "completely different"}}}
  });
  expect(newState).toMatchSnapshot();
  expect(anotherState).toMatchSnapshot();
  expect(modifiedMyArray).toMatchSnapshot();
});

it("setServerState returns the proper structure with multiple servers", () => {
  let currentState = {}; // no servers in there.
  let newState = setServerState(currentState, "random-server-id", {
    myArray: ["hello", "hello"],
    somethingElse: {hello: "World"}
  });
  expect(newState).toMatchSnapshot();
  let newServer = setServerState(newState, "Another-Server", {
    something: "Special"
  });
  expect(newServer).toMatchSnapshot();
});
