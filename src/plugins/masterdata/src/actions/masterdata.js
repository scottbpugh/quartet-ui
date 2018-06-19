import {createAction} from "redux-actions";

export default {
  loadLocations: createAction("MASTERDATA_LOAD_LOCATIONS"),
  loadCompanies: createAction("MASTERDATA_LOAD_COMPANIES"),
  loadTradeItems: createAction("MASTERDATA_LOAD_TRADE_ITEMS"),
  loadLocationTypes: createAction("MASTERDATA_LOAD_LOCATION_TYPES"),
  loadLocationDetail: createAction("MASTERDATA_LOAD_LOCATION_DETAIL")
};
