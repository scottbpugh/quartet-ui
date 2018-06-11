const defaultLocaleMsg = {
  masterData: {
    masterDataNav: "Master Data",
    locations: "Locations",
    companies: "Companies",
    addLocation: "Add a Location",
    errorLoadingEntries:
      "An error occurred while loading locations from this server. {error}",
    tradeItems: "Trade Items",
    addTradeItem: "Add a Trade Item",
    addTradeItemField: "Add a Trade Item Field",
    tradeItemFields: "Trade Item Fields",
    editTradeItem: "Edit Trade Item"
  }
};

const french = {
  masterDataNav: "Données de base",
  locations: "Site",
  companies: "Compagnies",
  addLocation: "Ajouter un site",
  errorLoadingEntries:
    "An error occurred while loading locations from this server. {error}",
  tradeItems: "Articles commerciaux",
  addTradeItem: "Ajouter un article commercial",
  addTradeItemField: "Ajouter un champ d'article commercial",
  tradeItemFields: "Champs d'articles commerciaux",
  editTradeItem: "Editer un article commercial"
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
