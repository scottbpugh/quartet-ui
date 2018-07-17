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
  epcis: {
    topNavItem: "Event Data",
    addEvent: "Add Event",
    editEvent: "Edit Event",
    addEntry: "Add Entry",
    editEntry: "Edit Entry",
    aggregationEvent: "Aggregation Event",
    objectEvent: "Object Event",
    transactionEvent: "Transaction Event",
    transformationEvent: "Transformation Event",
    what: "What",
    eventType: "Event Type",
    eventID: "Event ID",
    parentID: "Parent ID",
    epcList: "EPC List",
    inputEPCList: "Input EPC List",
    outputEPCList: "Output EPC List",
    ILMD: "Instance/Lot Master Data",
    childQuantityList: "Child Quantity List",
    inputQuantityList: "Input Quantity List",
    outputQuantityList: "Output Quantity List",
    quantityList: "Quantity List",
    childEPCs: "Child EPCs",
    businessTransactionList: "Business Transaction List",
    eventsTotal: "{eventsCount} events total",
    entriesTotal: "{entriesCount} entries total",
    noEPCISFound: "No EPCIS module detected on server.",
    aggregationEvents: "Aggregation Events",
    objectEvents: "Object Events",
    transactionEvents: "Transaction Events",
    transformationEvents: "Transformation Events",
    events: "Events",
    entries: "Entries",
    errorLoadingEvent: "An error occurred while loading this event. {error}",
    errorLoadingEntry: "An error occurred while loading this entry. {error}",
    errorLoadingEntries:
      "An error occurred while loading entries from this server. {error}",
    errorLoadingEvents:
      "An error occurred while loading events from this server. {error}",
    errorLoadingEntryGeo:
      "An error occurred while loading the geographic data related to this entry. {error}",
    where: "Where",
    why: "Why",
    when: "When",
    objectEvent: "Object Event",
    entryList: "Entries"
  }
};

const french = {
  topNavItem: "Données d'événements",
  addEvent: "Ajouter un évènement",
  editEvent: "Modifier l'événement",
  addEntry: "Ajouter une entrée",
  editEntry: "Modifier l'entrée",
  aggregationEvent: "Événement d'agrégation",
  objectEvent: "Événement d'objet",
  transactionEvent: "Événement de transaction",
  transformationEvent: "Événement de transformation",
  what: "Quoi",
  when: "Quand",
  where: "Où",
  why: "Pourquoi",
  eventType: "Type d'événement",
  eventID: "ID d'événement",
  parentID: "ID du parent",
  epcList: "Liste EPC",
  inputEPCList: "Liste EPC d'entrée",
  outputEPCList: "Liste EPC de sortie",
  ILMD: "Données de base d'instance/lot",
  childQuantityList: "Child Quantity List",
  inputQuantityList: "Input Quantity List",
  outputQuantityList: "Output Quantity List",
  quantityList: "Quantity List",
  childEPCs: "Child EPCs",
  businessTransactionList: "Business Transaction List",
  eventsTotal: "Total: {eventsCount}",
  entriesTotal: "Total: {entriesCount}",
  noEPCISFound: "Module EPCIS non détecté sur ce serveur.",
  aggregationEvents: "Événements d'agrégation",
  objectEvents: "Événements d'objet",
  transactionEvents: "Événements de transaction",
  transformationEvents: "Événements de transformation",
  events: "Événements",
  entries: "Entrées",
  entryList: "Entrées",
  errorLoadingEvent:
    "Une erreur s'est produite lors du chargement de cet événement. {error}",
  errorLoadingEntry:
    "Une erreur s'est produite lors du chargement de cette entrée. {error}",
  errorLoadingEntries:
    "Une erreur s'est produite lors du chargement des entrées de ce serveur. {error}",
  errorLoadingEvents:
    "Une erreur s'est produite lors du chargement des événements de ce serveur. {error}",
  errorLoadingEntryGeo:
    "Une erreur s'est produite lors du chargement des données géographiques liées à cettre entrée. {error}"
};

export default {
  "en-US": {plugins: {...defaultLocaleMsg}},
  "fr-FR": {
    plugins: {
      epcis: {
        ...defaultLocaleMsg.epcis,
        ...french
      }
    }
  }
};
