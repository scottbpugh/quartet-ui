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
import {Route} from "react-router";
import {AddEvent} from "./components/AddEvent";
import {AddEntry} from "./components/AddEntry";
import {AddMessage} from "./components/AddMessage";
import {EntryList} from "./components/EntryList";
import {EventList} from "./components/EventList";
import {EventDetail} from "./components/EventDetail";

export default (() => {
  return [
    <Route
      key="addEvent"
      path="/epcis/add-event/:serverID"
      component={AddEvent}
    />,
    <Route
      key="addEntry"
      path="/epcis/add-entry/:serverID"
      component={AddEntry}
    />,
    <Route
      key="addMessage"
      path="/epcis/add-message/:serverID"
      component={AddMessage}
    />,
    <Route
      key="entryList"
      path="/epcis/entry-list/:serverID"
      component={EntryList}
    />,
    <Route
      key="eventList"
      path="/epcis/event-list/:serverID/type/:eventType"
      component={EventList}
    />,
    <Route
      key="eventList"
      path="/epcis/event-list/:serverID"
      component={EventList}
    />,
    <Route
      key="eventList"
      path="/epcis/event-list/:serverID"
      component={EventList}
    />,
    <Route
      key="eventDetail"
      path="/epcis/event-detail/:serverID/uuid/:eventID"
      component={EventDetail}
    />
  ];
})();
