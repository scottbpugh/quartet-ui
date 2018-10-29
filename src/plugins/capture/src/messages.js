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
    rulesTopNav: "Rules",
    tasksTopNav: "Tasks",
    addRule: "Add a New Rule",
    editRule: "Edit Existing Rule",
    addStep: "Add a New Step",
    editStepParam: "Edit Step Parameter",
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
    addStepParam: "Add a New Step Parameter",
    processFileError:
      "An error occurred while processing this file. Please check the QU4RTET server for more information. {error}",
    errorFetchRuleParams:
      "An error occurred while retrieving parameters for this rule. Please check the QU4RTET server for more information.",
    ruleParameters: "Rule Parameters",
    stepParameters: "Step Parameters",
    addRuleParameter: "Add Rule Parameter",
    editRuleParam: "Edit Rule Parameter",
    noRuleFound: "No Capture module detected on server",
    steps: "Steps",
    taskCreated: "Task with id {taskID} has been created.",
    tasksTotal: "{tasksCount} tasks total.",
    selectRule: "Select a Rule",
    taskDetail: "Task Detail",
    restart: "Restart",
    confirmRestart: "Are you sure you want to restart this task?",
    confirmRestartBody:
      "Restarting this task will re-execute all of the logic for this rule.",
    executeTaskError:
    "An error occurred while attempting to re-execute this task: {error}"
  }
};

const french = {
  rulesTopNav: "Règles",
  tasksTopNav: "Tâches",
  addRule: "Ajouter une nouvelle règle",
  editRule: "Éditer règle",
  addStep: "Ajouter une nouvelle étape",
  editStep: "Éditer étape",
  editStepParam: "Éditer un paramètre d'étape",
  addTask: "Créer une nouvelle tâche",
  deleteStep: "Supprimer une étape",
  deleteStepConfirm: "Etes-vous certain de vouloir supprimer cette étape ?",
  deleteRule: "Supprimer une règle",
  deleteRuleConfirm: "Etes-vous certain de vouloir supprimer cette règle ?",
  uploadFile: "Envoi de fichier",
  uploadFileTitle: "Envoi de fichier {ruleName}",
  createTask: "Créer une tâche avec fichier",
  uploadedFile: "Fichier envoyé pour règle {ruleName}",
  addRuleParam: "Ajouter un nouveau paramètre de règle",
  addStepParam: "Ajouter un nouveau paramètre d'étape",
  processFileError:
    "Une erreur est survenue lors du traitement de ce fichier. Veuillez vérifier le serveur QU4RTET pour plus d'informations.",
  errorFetchRuleParams:
    "Une erreur s'est produite lors de la récupération des paramètres pour cette règle. Veuillez vérifier le serveur QU4RTET pour plus d'informations.",
  ruleParameters: "Paramètres de règle",
  addRuleParameter: "Ajouter un paramètre de règle",
  editRuleParam: "Editer un paramètre de règle",
  noRuleFound: "Module de capture non détecté sur ce serveur.",
  taskCreated: "Une tâche avec l'ID {taskID} a été créée.",
  tasksTotal: "Total des tâches: {tasksCount}",
  steps: "Étapes",
  selectRule: "Sélectionner une règle",
  restart: "Recommencer"
};

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
