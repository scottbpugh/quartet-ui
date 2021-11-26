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
import {AddRule} from "./components/AddRule";
import {AddStep} from "./components/AddStep";
import {AddTask} from "./components/CreateTask";
import {AddRuleParam} from "./components/AddRuleParam";
import {AddStepParam} from "./components/AddStepParam";
import {RuleList} from "./components/RuleList";
import {TasksList} from "./components/TasksList";
import {TaskDetail} from "./components/TaskDetail";

export default (() => {
  return [
    <Route
      key="ruleList"
      path="/capture/rules/:serverID"
      component={RuleList}
    />,
    <Route
      key="taskDetail"
      path="/capture/tasks/:serverID/detail/:taskName"
      component={TaskDetail}
    />,
    <Route
      key="tasksList"
      path="/capture/tasks/:serverID"
      component={TasksList}
    />,
    <Route
      key="addRule"
      path="/capture/add-rule/:serverID/rule/:ruleID?"
      component={AddRule}
    />,
    <Route
        key="editRule"
        path="/capture/edit-rule/:serverID/rule/:ruleID/step/:stepID?"
        component={AddRule}
    />,
    <Route
      key="addStep"
      path="/capture/add-step/:serverID/rule/:ruleID"
      component={AddStep}
    />,
    <Route
      key="editStep"
      path="/capture/edit-step/:serverID/rule/:ruleID/step/:stepID"
      component={AddStep}
    />,
    <Route
      key="createTask"
      path="/capture/add-task/:serverID/rule/:ruleID"
      component={AddTask}
    />,
    <Route
      key="addRuleParam"
      path="/capture/add-rule-param/:serverID/rule/:ruleID"
      component={AddRuleParam}
    />,
    <Route
      key="editRuleParam"
      path="/capture/edit-rule-param/:serverID/rule/:ruleID/ruleParam/:ruleParamID"
      component={AddRuleParam}
    />,
    <Route
      key="addStepParam"
      path="/capture/add-step-param/:serverID/rule/:ruleID/step/:stepID"
      component={AddStepParam}
    />,
    <Route
      key="editStepParam"
      path="/capture/edit-step-param/:serverID/rule/:ruleID/step/:stepID/stepParam/:stepParamID"
      component={AddStepParam}
    />
  ];
})();
