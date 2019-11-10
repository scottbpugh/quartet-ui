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
import "../../tools/MockQu4rtet";
const {TestWrapper} = window.require("./tools/mockStore");
const {_AddEPCISCriteria} = require("./EPCISCriteriaForm");
const React = window.require("react");
const renderer = require("react-test-renderer");

it("renders form properly", () => {
  const form = renderer
    .create(
      <TestWrapper>
        <_AddEPCISCriteria
          server={{
            serverID: "d0246781-67c6-474b-8ab0-29de61b6e6bb",
            protocol: "http",
            port: "8000",
            path: "",
            ssl: false,
            hostname: "localhost",
            serverSettingName: "box 1",
            url: "http://localhost:8000/",
            appList: [
              "",
              "capture",
              "epcis",
              "manifest",
              "rest-auth",
              "serialbox"
            ],
            username: "lduros",
            password: "password1234"
          }}
          loadEndpoints={() => {
            return [];
          }}
          match={{params: {serverID: "d0246781-67c6-474b-8ab0-29de61b6e6bb"}}}
        />
      </TestWrapper>
    )
    .toJSON();
  expect(form).toMatchSnapshot();
});
