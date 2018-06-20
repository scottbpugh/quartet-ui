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
import What from "./What";
import When from "./When";
import Where from "./Where";
import Why from "./Why";

it("what renders correctly an aggregation object with minimum data", () => {
  const what = renderer
    .create(
      <TestWrapper>
        <What
          currentEntry={{
            aggregationEvent: {eventID: "testID", parentID: "parent"}
          }}
          objectType="aggregationEvent"
          goTo={() => {}}
          serverID="bla"
        />
      </TestWrapper>
    )
    .toJSON();
  expect(what).toMatchSnapshot();
});

it("when renders correctly an aggregation object with minimum data", () => {
  const when = renderer
    .create(
      <TestWrapper>
        <When
          currentEntry={{
            aggregationEvent: {eventID: "testID", parentID: "parent"}
          }}
          objectType="aggregationEvent"
          goTo={() => {}}
          serverID="bla"
        />
      </TestWrapper>
    )
    .toJSON();
  expect(when).toMatchSnapshot();
});

it("where renders correctly an aggregation object with minimum data", () => {
  const where = renderer
    .create(
      <TestWrapper>
        <Where
          currentEntry={{
            aggregationEvent: {eventID: "testID", parentID: "parent"}
          }}
          objectType="aggregationEvent"
          goTo={() => {}}
          serverID="bla"
        />
      </TestWrapper>
    )
    .toJSON();
  expect(where).toMatchSnapshot();
});

it("why renders correctly an aggregation object with minimum data", () => {
  const why = renderer
    .create(
      <TestWrapper>
        <Why
          currentEntry={{
            aggregationEvent: {eventID: "testID", parentID: "parent"}
          }}
          objectType="aggregationEvent"
          goTo={() => {}}
          serverID="bla"
        />
      </TestWrapper>
    )
    .toJSON();
  expect(why).toMatchSnapshot();
});

it("renders correctly an aggregation object with most data", () => {
  const props = {
    goTo: () => {},
    currentEntry: {
      aggregationEvent: {
        id: "c3e7d711-c7d4-4d59-9de2-9825ee56ac9f",
        eventID: null,
        eventTime: "2018-01-22T22:51:49.294565+00:00",
        eventTimezoneOffset: "+00:00",
        recordTime: "2018-01-22T22:51:49.294565+00:00",
        errorDeclaration: null,
        action: "ADD",
        disposition: "urn:epcglobal:cbv:disp:container_closed",
        bizStep: "urn:epcglobal:cbv:bizstep:packing",
        readPoint: "urn:epc:id:sgln:305555.123456.12",
        bizLocation: "urn:epc:id:sgln:305555.123456.0",
        sourceList: {
          "urn:epcglobal:cbv:sdt:possessing_party":
            "urn:epc:id:sgln:305555.123456.0",
          "urn:epcglobal:cbv:sdt:location": "urn:epc:id:sgln:305555.123456.12"
        },
        destinationList: {
          "urn:epcglobal:cbv:sdt:owning_party":
            "urn:epc:id:sgln:309999.111111.0",
          "urn:epcglobal:cbv:sdt:location": "urn:epc:id:sgln:309999.111111.233"
        },
        bizTransactionList: {
          "urn:epc:id:gdti:0614141.06012.1234": "urn:epcglobal:cbv:btt:po"
        },
        parentID: "urn:epc:id:sgtin:305555.3555555.1",
        childEPCs: [
          "urn:epc:id:sgtin:305555.0555555.4",
          "urn:epc:id:sgtin:305555.0555555.5",
          "urn:epc:id:sgtin:305555.0555555.3",
          "urn:epc:id:sgtin:305555.0555555.1",
          "urn:epc:id:sgtin:305555.0555555.2"
        ],
        childQuantityList: [
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555555.*",
            quantity: 14.5,
            uom: "LB"
          },
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555555.*",
            quantity: 5,
            uom: null
          }
        ]
      }
    },
    objectType: "aggregationEvent",
    serverID: "2160ce42-5c0a-458e-ba97-fe8555a06aa9"
  };
  const what = renderer
    .create(
      <TestWrapper>
        <What {...props} />
      </TestWrapper>
    )
    .toJSON();
  const when = renderer
    .create(
      <TestWrapper>
        <When {...props} />
      </TestWrapper>
    )
    .toJSON();
  const where = renderer
    .create(
      <TestWrapper>
        <Where {...props} />
      </TestWrapper>
    )
    .toJSON();
  const why = renderer
    .create(
      <TestWrapper>
        <Why {...props} />
      </TestWrapper>
    )
    .toJSON();
  expect(what).toMatchSnapshot();
  expect(where).toMatchSnapshot();
  expect(why).toMatchSnapshot();
  expect(when).toMatchSnapshot();
});

it("renders correctly an object with most data", () => {
  const props = {
    goTo: () => {},
    className: "w4-container large-cards-container no-header",
    serverID: "2160ce42-5c0a-458e-ba97-fe8555a06aa9",
    objectType: "objectEvent",
    currentEntry: {
      objectEvent: {
        id: "eecdcc89-ce7f-4d32-aebe-86eb66d4a178",
        eventID: null,
        eventTime: "2018-01-22T22:51:49.294565+00:00",
        eventTimezoneOffset: "+00:00",
        recordTime: "2018-01-22T22:51:49.294565+00:00",
        errorDeclaration: null,
        action: "ADD",
        disposition: "urn:epcglobal:cbv:disp:encoded",
        bizStep: "urn:epcglobal:cbv:bizstep:commissioning",
        readPoint: "urn:epc:id:sgln:305555.123456.12",
        bizLocation: "urn:epc:id:sgln:305555.123456.0",
        sourceList: {
          "urn:epcglobal:cbv:sdt:possessing_party":
            "urn:epc:id:sgln:305555.123456.0",
          "urn:epcglobal:cbv:sdt:location": "urn:epc:id:sgln:305555.123456.12"
        },
        destinationList: {
          "urn:epcglobal:cbv:sdt:owning_party":
            "urn:epc:id:sgln:309999.111111.0",
          "urn:epcglobal:cbv:sdt:location": "urn:epc:id:sgln:309999.111111.233"
        },
        bizTransactionList: {
          "urn:epc:id:gdti:0614141.06012.1234": "urn:epcglobal:cbv:btt:po"
        },
        epc_list: [
          "urn:epc:id:sgtin:305555.0555555.4",
          "urn:epc:id:sgtin:305555.0555555.5",
          "urn:epc:id:sgtin:305555.0555555.3",
          "urn:epc:id:sgtin:305555.0555555.1",
          "urn:epc:id:sgtin:305555.0555555.2"
        ],
        ilmd: {lotNumber: "DL232", itemExpirationDate: "2015-12-31"},
        quantity_list: {}
      }
    },
    history: {
      length: 460,
      action: "PUSH",
      location: {
        pathname:
          "/epcis/event-detail/2160ce42-5c0a-458e-ba97-fe8555a06aa9/uuid/eecdcc89-ce7f-4d32-aebe-86eb66d4a178",
        search: "",
        hash: "",
        key: "inhml0"
      }
    }
  };
  const what = renderer
    .create(
      <TestWrapper>
        <What {...props} />
      </TestWrapper>
    )
    .toJSON();
  const when = renderer
    .create(
      <TestWrapper>
        <When {...props} />
      </TestWrapper>
    )
    .toJSON();
  const where = renderer
    .create(
      <TestWrapper>
        <Where {...props} />
      </TestWrapper>
    )
    .toJSON();
  const why = renderer
    .create(
      <TestWrapper>
        <Why {...props} />
      </TestWrapper>
    )
    .toJSON();
  expect(what).toMatchSnapshot();
  expect(where).toMatchSnapshot();
  expect(why).toMatchSnapshot();
  expect(when).toMatchSnapshot();
});

it("renders correctly a transaction event with most data", () => {
  const props = {
    goTo: () => {},
    className: "w4-container large-cards-container no-header",
    objectType: "transactionEvent",
    serverID: "2160ce42-5c0a-458e-ba97-fe8555a06aa9",
    currentEntry: {
      transactionEvent: {
        id: "1c2ad518-0749-4cbc-9a3e-f9113c399e91",
        eventID: null,
        eventTime: "2018-01-22T22:51:49.294565+00:00",
        eventTimezoneOffset: "+00:00",
        recordTime: "2018-01-22T22:51:49.294565+00:00",
        errorDeclaration: null,
        action: "ADD",
        disposition: "urn:epcglobal:cbv:disp:in_transit",
        bizStep: "urn:epcglobal:cbv:bizstep:shipping",
        readPoint: "urn:epc:id:sgln:305555.123456.12",
        bizLocation: "urn:epc:id:sgln:305555.123456.0",
        sourceList: {
          "urn:epcglobal:cbv:sdt:possessing_party":
            "urn:epc:id:sgln:305555.123456.0",
          "urn:epcglobal:cbv:sdt:location": "urn:epc:id:sgln:305555.123456.12"
        },
        destinationList: {
          "urn:epcglobal:cbv:sdt:owning_party":
            "urn:epc:id:sgln:309999.111111.0",
          "urn:epcglobal:cbv:sdt:location": "urn:epc:id:sgln:309999.111111.233"
        },
        bizTransactionList: {
          "urn:epc:id:gdti:0614141.06012.1234": "urn:epcglobal:cbv:btt:po"
        },
        parentID: "urn:epc:id:sgtin:305555.3555555.1",
        epcList: [
          "urn:epc:id:sgtin:305555.0555555.4",
          "urn:epc:id:sgtin:305555.0555555.5",
          "urn:epc:id:sgtin:305555.0555555.3",
          "urn:epc:id:sgtin:305555.0555555.1",
          "urn:epc:id:sgtin:305555.0555555.2"
        ],
        quantityList: [
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555555.*",
            quantity: 14.5,
            uom: "LB"
          },
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555555.*",
            quantity: 5,
            uom: null
          }
        ]
      }
    },
    history: {
      length: 464,
      action: "PUSH",
      location: {
        pathname:
          "/epcis/event-detail/2160ce42-5c0a-458e-ba97-fe8555a06aa9/uuid/1c2ad518-0749-4cbc-9a3e-f9113c399e91",
        search: "",
        hash: "",
        key: "7bobkg"
      }
    }
  };
  const what = renderer
    .create(
      <TestWrapper>
        <What {...props} />
      </TestWrapper>
    )
    .toJSON();
  const when = renderer
    .create(
      <TestWrapper>
        <When {...props} />
      </TestWrapper>
    )
    .toJSON();
  const where = renderer
    .create(
      <TestWrapper>
        <Where {...props} />
      </TestWrapper>
    )
    .toJSON();
  const why = renderer
    .create(
      <TestWrapper>
        <Why {...props} />
      </TestWrapper>
    )
    .toJSON();
  expect(what).toMatchSnapshot();
  expect(where).toMatchSnapshot();
  expect(why).toMatchSnapshot();
  expect(when).toMatchSnapshot();
});

it("renders correctly a transformation event with most data", () => {
  const props = {
    goTo: () => {},
    className: "w4-container large-cards-container no-header",
    serverID: "2160ce42-5c0a-458e-ba97-fe8555a06aa9",
    objectType: "transformationEvent",
    currentEntry: {
      transformationEvent: {
        id: "6fe15e4a-0e52-4583-9731-43e7a3b98ead",
        eventID: "9db05f77-e007-41a2-a6d9-140254b7ce5a",
        eventTime: "2018-01-29T18:50:20.847426+00:00",
        eventTimezoneOffset: "+00:00",
        recordTime: "2018-01-29T18:50:20.847426+00:00",
        errorDeclaration: {
          declarationTime: "2018-06-14T10:42:11.275921+00:00",
          reason: null,
          correctiveEventIDs: [
            "fd2c6646-e4f9-4ed8-a5e5-e98614d6ce84",
            "4b9932b7-45f7-4983-8b62-95c2784a2fc8"
          ]
        },
        inputEPCList: [
          "urn:epc:id:sgtin:305555.1555555.1002",
          "urn:epc:id:sgtin:305555.1555555.1003",
          "urn:epc:id:sgtin:305555.1555555.1005",
          "urn:epc:id:sgtin:305555.1555555.1001",
          "urn:epc:id:sgtin:305555.1555555.1007",
          "urn:epc:id:sgtin:305555.1555555.1009",
          "urn:epc:id:sgtin:305555.1555555.1008",
          "urn:epc:id:sgtin:305555.1555555.1000",
          "urn:epc:id:sgtin:305555.1555555.1006",
          "urn:epc:id:sgtin:305555.1555555.1004"
        ],
        inputQuantityList: [
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555551.*",
            quantity: 94.3,
            uom: "LB"
          },
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555551.*",
            quantity: 100,
            uom: "EA"
          }
        ],
        outputEPCList: [
          "urn:epc:id:sgtin:305555.1555555.2000",
          "urn:epc:id:sgtin:305555.1555555.2002",
          "urn:epc:id:sgtin:305555.1555555.2001",
          "urn:epc:id:sgtin:305555.1555555.2003",
          "urn:epc:id:sgtin:305555.1555555.2007",
          "urn:epc:id:sgtin:305555.1555555.2006",
          "urn:epc:id:sgtin:305555.1555555.2004",
          "urn:epc:id:sgtin:305555.1555555.2009",
          "urn:epc:id:sgtin:305555.1555555.2008",
          "urn:epc:id:sgtin:305555.1555555.2005"
        ],
        outputQuantityList: [
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555551.*",
            quantity: 94.3,
            uom: "LB"
          },
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555551.*",
            quantity: 10,
            uom: "EA"
          }
        ],
        transformationID: null,
        bizStep: "urn:epcglobal:cbv:bizstep:repackaging",
        bizLocation: "urn:epc:id:sgln:305555.123456.0",
        disposition: "urn:epcglobal:cbv:disp:returned",
        readPoint: "urn:epc:id:sgln:305555.123456.12",
        bizTransactionList: {
          "urn:epcglobal:cbv:bt:0555555555555.00001":
            "urn:epcglobal:cbv:btt:bol",
          "urn:epcglobal:cbv:bt:0555555555555.DE45_111":
            "urn:epcglobal:cbv:btt:desadv"
        },
        sourceList: {
          "urn:epcglobal:cbv:sdt:possessing_party":
            "urn:epc:id:sgln:305555.123456.0",
          "urn:epcglobal:cbv:sdt:location": "urn:epc:id:sgln:305555.123456.12"
        },
        destinationList: {
          "urn:epcglobal:cbv:sdt:owning_party":
            "urn:epc:id:sgln:309999.111111.0",
          "urn:epcglobal:cbv:sdt:location": "urn:epc:id:sgln:309999.111111.233"
        },
        ilmd: {lotNumber: "DL232", itemExpirationDate: "2015-12-31"}
      }
    },
    history: {
      length: 529,
      action: "PUSH",
      location: {
        pathname:
          "/epcis/event-detail/2160ce42-5c0a-458e-ba97-fe8555a06aa9/uuid/6fe15e4a-0e52-4583-9731-43e7a3b98ead",
        search: "",
        hash: "",
        key: "0xqxi7"
      }
    }
  };
  const what = renderer
    .create(
      <TestWrapper>
        <What {...props} />
      </TestWrapper>
    )
    .toJSON();
  const when = renderer
    .create(
      <TestWrapper>
        <When {...props} />
      </TestWrapper>
    )
    .toJSON();
  const where = renderer
    .create(
      <TestWrapper>
        <Where {...props} />
      </TestWrapper>
    )
    .toJSON();
  const why = renderer
    .create(
      <TestWrapper>
        <Why {...props} />
      </TestWrapper>
    )
    .toJSON();
  expect(what).toMatchSnapshot();
  expect(where).toMatchSnapshot();
  expect(why).toMatchSnapshot();
  expect(when).toMatchSnapshot();
});

it("renders correctly an unknown event with most data", () => {
  const props = {
    goTo: () => {},
    className: "w4-container large-cards-container no-header",
    serverID: "2160ce42-5c0a-458e-ba97-fe8555a06aa9",
    objectType: "illegalEvent",
    currentEntry: {
      illegalEvent: {
        id: "6fe15e4a-0e52-4583-9731-43e7a3b98ead",
        eventID: "9db05f77-e007-41a2-a6d9-140254b7ce5a",
        eventTime: "2018-01-29T18:50:20.847426+00:00",
        eventTimezoneOffset: "+00:00",
        recordTime: "2018-01-29T18:50:20.847426+00:00",
        errorDeclaration: {
          declarationTime: "2018-06-14T10:42:11.275921+00:00",
          reason: null,
          correctiveEventIDs: [
            "fd2c6646-e4f9-4ed8-a5e5-e98614d6ce84",
            "4b9932b7-45f7-4983-8b62-95c2784a2fc8"
          ]
        },
        inputEPCList: [
          "urn:epc:id:sgtin:305555.1555555.1002",
          "urn:epc:id:sgtin:305555.1555555.1003",
          "urn:epc:id:sgtin:305555.1555555.1005",
          "urn:epc:id:sgtin:305555.1555555.1001",
          "urn:epc:id:sgtin:305555.1555555.1007",
          "urn:epc:id:sgtin:305555.1555555.1009",
          "urn:epc:id:sgtin:305555.1555555.1008",
          "urn:epc:id:sgtin:305555.1555555.1000",
          "urn:epc:id:sgtin:305555.1555555.1006",
          "urn:epc:id:sgtin:305555.1555555.1004"
        ],
        inputQuantityList: [
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555551.*",
            quantity: 94.3,
            uom: "LB"
          },
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555551.*",
            quantity: 100,
            uom: "EA"
          }
        ],
        outputEPCList: [
          "urn:epc:id:sgtin:305555.1555555.2000",
          "urn:epc:id:sgtin:305555.1555555.2002",
          "urn:epc:id:sgtin:305555.1555555.2001",
          "urn:epc:id:sgtin:305555.1555555.2003",
          "urn:epc:id:sgtin:305555.1555555.2007",
          "urn:epc:id:sgtin:305555.1555555.2006",
          "urn:epc:id:sgtin:305555.1555555.2004",
          "urn:epc:id:sgtin:305555.1555555.2009",
          "urn:epc:id:sgtin:305555.1555555.2008",
          "urn:epc:id:sgtin:305555.1555555.2005"
        ],
        outputQuantityList: [
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555551.*",
            quantity: 94.3,
            uom: "LB"
          },
          {
            epcClass: "urn:epc:idpat:sgtin:305555.0555551.*",
            quantity: 10,
            uom: "EA"
          }
        ],
        transformationID: null,
        bizStep: "urn:epcglobal:cbv:bizstep:repackaging",
        bizLocation: "urn:epc:id:sgln:305555.123456.0",
        disposition: "urn:epcglobal:cbv:disp:returned",
        readPoint: "urn:epc:id:sgln:305555.123456.12",
        bizTransactionList: {
          "urn:epcglobal:cbv:bt:0555555555555.00001":
            "urn:epcglobal:cbv:btt:bol",
          "urn:epcglobal:cbv:bt:0555555555555.DE45_111":
            "urn:epcglobal:cbv:btt:desadv"
        },
        sourceList: {
          "urn:epcglobal:cbv:sdt:possessing_party":
            "urn:epc:id:sgln:305555.123456.0",
          "urn:epcglobal:cbv:sdt:location": "urn:epc:id:sgln:305555.123456.12"
        },
        destinationList: {
          "urn:epcglobal:cbv:sdt:owning_party":
            "urn:epc:id:sgln:309999.111111.0",
          "urn:epcglobal:cbv:sdt:location": "urn:epc:id:sgln:309999.111111.233"
        },
        ilmd: {lotNumber: "DL232", itemExpirationDate: "2015-12-31"}
      }
    },
    history: {
      length: 529,
      action: "PUSH",
      location: {
        pathname:
          "/epcis/event-detail/2160ce42-5c0a-458e-ba97-fe8555a06aa9/uuid/6fe15e4a-0e52-4583-9731-43e7a3b98ead",
        search: "",
        hash: "",
        key: "0xqxi7"
      }
    }
  };
  const what = renderer
    .create(
      <TestWrapper>
        <What {...props} />
      </TestWrapper>
    )
    .toJSON();
  const when = renderer
    .create(
      <TestWrapper>
        <When {...props} />
      </TestWrapper>
    )
    .toJSON();
  const where = renderer
    .create(
      <TestWrapper>
        <Where {...props} />
      </TestWrapper>
    )
    .toJSON();
  const why = renderer
    .create(
      <TestWrapper>
        <Why {...props} />
      </TestWrapper>
    )
    .toJSON();
  expect(what).toMatchSnapshot();
  expect(where).toMatchSnapshot();
  expect(why).toMatchSnapshot();
  expect(when).toMatchSnapshot();
});
