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
import configureStore from "redux-mock-store";
import {MemoryRouter as Router, withRouter} from "react-router-dom";
import {IntlProvider, intlReducer} from "react-intl-redux";
import {Provider} from "react-redux";
import {mockStore, TestWrapper, initialState} from "tools/mockStore";
import {pluginRegistry} from "plugins/pluginRegistration";
import {Server} from "lib/servers";
import sinon from "sinon";
import {prepHeadersAuth, getFormInfo} from "lib/server-api";

it("yields the correct header object with auth", () => {
  const store = mockStore(initialState);
  const props = {
    match: {
      params: {
        serverID: "d0246781-67c6-474b-8ab0-29de61b6e6bb"
      }
    }
  };
  pluginRegistry.registerServer(
    new Server(
      initialState.serversettings.servers[
        "d0246781-67c6-474b-8ab0-29de61b6e6bb"
      ]
    )
  );
  const s = pluginRegistry.getServer("d0246781-67c6-474b-8ab0-29de61b6e6bb");
  sinon.stub(s, "getAuthorization").callsFake(() => {
    return `Token someToken`;
  });
  prepHeadersAuth(s, "GET").then(object => {
    expect(object).toMatchSnapshot();
    expect(JSON.stringify(object)).toMatchSnapshot();
  });
});

it("getFormInfo returns a properly structured object from a django options call (mocked)", async () => {
  const store = mockStore(initialState);
  const props = {
    match: {
      params: {
        serverID: "d0246781-67c6-474b-8ab0-29de61b6e6bb"
      }
    }
  };
  pluginRegistry.registerServer(
    new Server(
      initialState.serversettings.servers[
        "d0246781-67c6-474b-8ab0-29de61b6e6bb"
      ]
    )
  );
  const s = pluginRegistry.getServer("d0246781-67c6-474b-8ab0-29de61b6e6bb");
  sinon.stub(s, "getAuthorization").callsFake(() => {
    return `Token someToken`;
  });

  const stubbedFetch = sinon.stub(window, "fetch").callsFake(() => {
    return Promise.resolve({
      json: () => Promise.resolve({
        name: "Company List",
        description: "CRUD ready model view for the Company model.",
        renders: ["application/json", "text/html", "application/xml"],
        parses: [
          "application/json",
          "application/x-www-form-urlencoded",
          "multipart/form-data"
        ],
        actions: {
          POST: {
            id: {
              type: "integer",
              required: false,
              read_only: true,
              label: "ID"
            },
            GLN13: {
              type: "string",
              required: false,
              read_only: false,
              label: "GLN13",
              help_text:
                  "The GLN (Global Location Number) provides a standard means to identify legal entities, trading parties and locations to support the requirements of electronic commerce. The GLN-13 is defined by GS1",
              max_length: 13
            },
            SGLN: {
              type: "string",
              required: false,
              read_only: false,
              label: "SGLN",
              help_text:
                  "The SGLN EPC scheme is used to assign a unique identity to a physical location or sub-location, such as a specific building or a specific unit of shelving within a warehouse.  TheSGLN is expressed as a URN value.",
              max_length: 150
            },
            name: {
              type: "string",
              required: true,
              read_only: false,
              label: "Name",
              help_text: "A unique name for the location or party.",
              max_length: 128
            },
            address1: {
              type: "string",
              required: false,
              read_only: false,
              label: "Street Address One",
              help_text:
                  "For example, the name of the street and the number in the street or the name of a building",
              max_length: 1000
            },
            address2: {
              type: "string",
              required: false,
              read_only: false,
              label: "Street Address Two",
              help_text:
                  "The second free form line complements the first free form line to locate the party or location.",
              max_length: 1000
            },
            address3: {
              type: "string",
              required: false,
              read_only: false,
              label: "Street Address Three",
              help_text:
                  "The third free form line complements the first and second free form lines where necessary.",
              max_length: 1000
            },
            country: {
              type: "string",
              required: false,
              read_only: false,
              label: "Country Code",
              help_text: "Country ISO 3166-1 alpha-2 Code",
              max_length: 2
            },
            city: {
              type: "string",
              required: false,
              read_only: false,
              label: "City",
              help_text: "City",
              max_length: 50
            },
            state_province: {
              type: "string",
              required: false,
              read_only: false,
              label: "State or Province",
              help_text:
                  "One of the constituent units of a nation having a federal government.",
              max_length: 20
            },
            postal_code: {
              type: "string",
              required: false,
              read_only: false,
              label: "Postal Code",
              help_text: "Postal Code",
              max_length: 20
            },
            latitude: {
              type: "decimal",
              required: false,
              read_only: false,
              label: "Latitude",
              help_text:
                  " Latitude of the location, in degrees. Positive numbers are northern latitude; negative numbers are southern latitude."
            },
            longitude: {
              type: "decimal",
              required: false,
              read_only: false,
              label: "Longitude",
              help_text:
                  "Longitude of the location, in degrees. Positive numbers are eastern longitude; negative numbers are western longitude."
            },
            gs1_company_prefix: {
              type: "string",
              required: true,
              read_only: false,
              label: "GS1 Company Prefix",
              help_text:
                  "A GS1 Company Prefix is a unique string of four to twelve digits used to issue GS1 identification keys.",
              max_length: 12
            },
            company_type: {
              type: "field",
              required: false,
              read_only: false,
              label: "Type",
              help_text: "Describes the type of company."
            }
          }
        }
      })
    });
  });
  await getFormInfo(s, "/some-path/", formStructure => {
    expect(formStructure).toMatchSnapshot();
  });
});
