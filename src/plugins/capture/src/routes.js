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
import {AddRule} from "./components/AddRule";
import {AddStep} from "./components/AddStep";
import {AddTask} from "./components/CreateTask";
import {Route} from "react-router";
import {RuleList} from "./components/RuleList";

export default (() => {
  return [
    <Route
      key="ruleList"
      path="/capture/rules/:serverID"
      component={RuleList}
    />,
    <Route
      key="addRule"
      path="/capture/add-rule/:serverID/:ruleName?"
      component={AddRule}
    />,
    <Route
      key="addStep"
      path="/capture/add-step/:serverID/:ruleName"
      component={AddStep}
    />,
    <Route
      key="editStep"
      path="/capture/edit-step/:serverID/:ruleName/:stepName"
      component={AddStep}
    />,
    <Route
      key="createTask"
      path="/capture/add-task/:serverID/:ruleName"
      component={AddTask}
    />
  ];
})();
