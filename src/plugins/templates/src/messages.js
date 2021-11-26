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
  templates: {
    navItemsTitle: "Message Templating",
    noTemplatesFound: "No Templates module detected on server",
    templatesNav: "Templates",
    templateList: "Templates",
    id: "ID",
    username: "Username",
    name: "Name",
    description: "Description",
    errorLoadingTemplatesList:
      "An error occurred while loading the template list from this server. {error}",
    addTemplate: "Add Template",
    editTemplate: "Edit Template",
    editEPCISCriteria: "Edit EPCIS Output Criteria",
    editAuthentication: "Edit Authentication Info",
    deleteTemplateConfirm: "Are you sure you want to delete this template?",
    deleteTemplateConfirmBody: "This will erase it permanently from the server"
  }
};

const french = {
  noOutputFound: "Module Output non détecté sur ce serveur",
  id: "Identifiant",
  username: "Nom d'utilisateur",
  type: "Type",
  description: "Description",
  name: "Nom",
  urn: "URN",
  addAuthentication: "Ajouter une authentification",
  errorLoadingAuthenticationList:
    "Une erreur s'est produite lors du chargement de la liste d'authentification à partir de ce serveur. {error}"
};

export default {
  "en-US": {plugins: {...defaultLocaleMsg}},
  "fr-FR": {
    plugins: {
      output: {
        ...defaultLocaleMsg.output,
        ...french
      }
    }
  }
};
