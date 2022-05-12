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
  output: {
    navItemsTitle: "Output",
    noOutputFound: "No Output module detected on server",
    authenticationNav: "Authentication",
    endpointsNav: "End Points",
    EPCISOutputNav: "EPCIS Output Criteria",
    authenticationList: "Authentication",
    authenticationInfo: "Authentication Info",
    bizStep: "Business Step",
    bizLocation: "Business Location",
    sourceType: "Source Type",
    destinationType: "Destination Type",
    id: "ID",
    username: "Username",
    type: "Type",
    description: "Description",
    name: "Name",
    urn: "URN",
    endpoint: "End Point",
    endpointsList: "End Points",
    addAuthentication: "Add Authentication Info",
    errorLoadingAuthenticationList:
      "An error occurred while loading the authentication list from this server. {error}",
    errorLoadingEndpoints:
      "An error occurred while loading End Points from this server. {error}",
    addEndpoint: "Add End Point",
    addEPCISCriteria: "Add EPCIS Output Criteria",
    addEPCISOutputCriteria: "Add EPCIS Output Criteria",
    EPCISOutputCriteriaList: "EPCIS Output Criteria",
    errorLoadingCriteria:
      "An error occurred while loading EPCIS Output Criteria from this server. {error}",
    editEndpoint: "Edit End Point",
    editEPCISCriteria: "Edit EPCIS Output Criteria",
    editAuthentication: "Edit Authentication Info",
    deleteAuthenticationConfirm:
      "Are you sure you want to delete this authentication info?",
    deleteAuthenticationConfirmBody:
      "This will erase it permanently from the server",
    deleteEndpointConfirm: "Are you sure you want to delete this End-point?",
    deleteEndpointConfirmBody: "This will erase it permanently from the server",
    deleteCriteriaConfirm:
      "Are you sure you want to delete this EPCIS Output Criteria?",
    deleteCriteriaConfirmBody: "This will erase it permanently from the server"
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
