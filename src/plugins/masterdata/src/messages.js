const defaultLocaleMsg = {
  masterData: {
    masterDataNav: "Master Data",
    locations: "Locations",
    companies: "Companies",
    addLocation: "Add a Location",
    editLocation: "Edit a Location",
    addCompany: "Add a Company",
    editCompany: "Edit a Company",
    errorLoadingEntries:
      "An error occurred while loading locations from this server. {error}",
    errorLoadingTradeItems:
      "An error occurred while loading trade items from this server. {error}",
    errorLoadingCompanies:
      "An error occurred while loading companies from this server. {error}",
    errorLoadingLocations:
      "An error occurred while loading locations from this server. {error}",
    errorLoadingLocationTypes:
      "An error occurred while loading location types from this server. {error}",
    tradeItems: "Trade Items",
    addTradeItem: "Add a Trade Item",
    addTradeItemField: "Add a Trade Item Field",
    tradeItemFields: "Trade Item Fields",
    editTradeItem: "Edit Trade Item",
    addLocationType: "Add a Location Type",
    noMasterDataFound: "No Master Data module detected on server.",
    locationDetail: "Location Detail",
    deleteLocationConfirm: "Are you sure you want to delete this location?",
    deleteLocationConfirmBody:
      "This will delete this delete this location permanently.",
    deleteCompanyConfirm: "Are you sure you want to delete this company?",
    deleteCompanyConfirmBody:
      "This will delete this delete this company permanently."
  }
};

const french = {
  masterDataNav: "Données de base",
  locations: "Sites",
  addLocationType: "Ajouter un type de site",
  companies: "Compagnies",
  addCompany: "Ajouter une compagnie",
  editCompany: "Modifier une compagnie",
  addLocation: "Ajouter un site",
  editLocation: "Modifier un site",
  errorLoadingEntries:
    "An error occurred while loading locations from this server. {error}",
  tradeItems: "Articles commerciaux",
  addTradeItem: "Ajouter un article commercial",
  addTradeItemField: "Ajouter un champ d'article commercial",
  tradeItemFields: "Champs d'articles commerciaux",
  editTradeItem: "Editer un article commercial",
  deleteLocationConfirm: "Are you sure you want to delete this entry?",
  deleteLocationConfirmBody: "This will delete this location permanently."
};

export default {
  "en-US": {plugins: {...defaultLocaleMsg}},
  "fr-FR": {
    plugins: {
      masterData: {
        ...defaultLocaleMsg.masterData,
        ...french
      }
    }
  }
};
