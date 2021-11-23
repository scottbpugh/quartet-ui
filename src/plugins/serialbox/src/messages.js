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
  numberRange: {
    pool: "Pool",
    region: "Region",
    allocation: "Allocation",
    allocateButton: "Allocate from Pool",
    createdOn: "Created On",
    readableName: "Readable Name",
    machineName: "Machine Name",
    status: "Status",
    requestThreshold: "Request Threshold",
    regions: "Regions",
    numberRangePools: "Number Pools",
    active: "active",
    inactive: "inactive",
    range: "Range",
    to: "to",
    state: "State",
    addSequentialRegion: "Add a New Sequential Region",
    editSequentialRegion: "Edit Sequential Region",
    addRandomizedRegion: "Add a New Randomized Region",
    addListBasedRegion: "Add a New List-based Region",
    editRandomizedRegion: "Edit Randomized Region",
    editListBasedRegion: "Edit List-based Region",
    addPool: "Add a New Pool",
    editPool: "Edit Pool",
    noRegionInPool: "There is currently no region in this pool.",
    regionDetailTitle: "Pool {poolName} Regions",
    navItemsTitle: "Number Pools",
    current: "Current",
    remaining: "Remaining",
    serial: "Sequential",
    randomized: "Randomized",
    listBased: "List-Based",
    deleteRegion: "Delete region {regionName}",
    allocatedSuccess:
      "{size} allocated to region {regionName}. You will be prompted to save the export file shortly.",
    regionDeletedSuccessfully: "Region deleted successfully",
    deletePool: "Delete Pool {poolName}",
    deleteRegionConfirm: "Are you sure you want to delete this region?",
    deletePoolConfirm: "Are you sure you want to delete this pool?",
    errorFetchPools:
      "An error occurred while attempting to fetch pools from {serverName}",
    errorVanilla: "An error occurred while performing this operation. {error}",
    errorFetchPool:
      "An error occurred while attempting to fetch {poolName}. {error}",
    errorFetchRegion:
      "An error occurred while attempting to get region information. {error}",
    errorAllocating:
      "An error occurred while attempting to allocate from pool {poolName}. {error}",
    errorFormFetch:
      "An error occurred while attempting to get this form from remote server {serverName}. {error}",
    errorFailedToGenerateFile:
      "An error occurred when attempting to generate an export file from allocation.",
    noNumberRangeFound: "No Number Range module detected on server",
    processingClass: "Processing Class",
    addProcessingParameter: "Add",
    processingParameters: "Processing Parameters",
    addParamEditOnly: "Add Parameter (Edit Only)",
    addResponseRule: "Add a Response Rule",
    responseRules: "Response Rules",
    editResponseRule: "Edit Response Rule"
  }
};

const french = {
  pool: "Groupe",
  region: "Région",
  allocation: "Attribution",
  allocateButton: "Attribuer au groupe",
  createdOn: "Créé le",
  readableName: "Nom",
  machineName: "Nom machine",
  current: "Actuel",
  status: "Statut",
  requestThreshold: "Seuil de requêtes",
  regions: "Régions",
  numberRangePools: "Groupes de plages de numéros",
  active: "actif",
  inactive: "inactif",
  range: "Plage",
  to: "à",
  state: "État",
  addSequentialRegion: "Ajouter une region séquentielle",
  addRandomizedRegion: "Ajouter une region randomisée",
  addListBasedRegion: "Ajouter une region de liste",
  editListBasedRegion: "Editer région de liste",
  editRandomizedRegion: "Editer région randomisée",
  editSequentialRegion: "Editer région séquentielle",
  addPool: "Ajouter un Groupe",
  noRegionInPool: "Il n'existe aucune region dans ce groupe.",
  regionDetailTitle: "Regions du groupe {poolName}",
  navItemsTitle: "Numéros de série",
  remaining: "Restant",
  noNumberRangeFound: "Module de plage de numéros non détecté sur ce serveur",
  listBased: "Liste",
  randomized: "randomisé",
  serial: "Séquentiel",
  processingClass: "Classe de traitement",
  addParamEditOnly: "Ajouter paramètre (Région existante)",
  addResponseRule: "Ajouter une règle de réponse",
  responseRules: "Règles de réponse",
  editResponseRule: "Modifier règle de réponse"
};

export default {
  "en-US": {plugins: {...defaultLocaleMsg}},
  "fr-FR": {
    plugins: {
      numberRange: {
        ...defaultLocaleMsg.numberRange,
        ...french
      }
    }
  }
};
