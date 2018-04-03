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

const defaultLocaleMsg = {
  capture: {
    navItemsTitle: "Capture",
    addRule: "Add a New Rule",
    editRule: "Edit Existing Rule",
    addStep: "Add a New Step",
    editStep: "Edit Step",
    addTask: "Create a New Task",
    deleteStep: "Delete Step",
    deleteStepConfirm: "Are you sure you want to delete this step?",
    deleteRule: "Delete Rule",
    deleteRuleConfirm: "Are you sure you want to delete this rule?",
    uploadFile: "File Upload",
    uploadFileTitle: "{ruleName} File Upload",
    createTask: "Create Task with File",
    uploadedFile: "File uploaded for rule {ruleName}",
    addRuleParam: "Add a New Rule Parameter",
    processFileError:
      "An error occurred while processing this file. Please check the QU4RTET server for more information.",
    errorFetchRuleParams:
      "An error occurred while retrieving parameters for this rule. Please check the QU4RTET server for more information.",
    ruleParameters: "Rule Parameters",
    addRuleParameter: "Add Rule Parameter"
  }
};

const french = {};

export default {
  "en-US": {plugins: {...defaultLocaleMsg}},
  "fr-FR": {
    plugins: {
      capture: {
        ...defaultLocaleMsg.Capture,
        ...french
      }
    }
  }
};
