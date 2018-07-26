import {createAction} from "redux-actions";

export default {
  loadLocations: createAction("MASTERDATA_LOAD_LOCATIONS"),
  loadCompanies: createAction("MASTERDATA_LOAD_COMPANIES"),
  loadTradeItems: createAction("MASTERDATA_LOAD_TRADE_ITEMS"),
  loadLocationTypes: createAction("MASTERDATA_LOAD_LOCATION_TYPES"),
  loadLocationDetail: createAction("MASTERDATA_LOAD_LOCATION_DETAIL"),
  loadCompanyTypes: createAction("MASTERDATA_LOAD_COMPANY_TYPES"),
  loadAllLocationTypes: createAction("MASTERDATA_LOAD_ALL_LOCATION_TYPES"),
  loadAllCompanyTypes: createAction("MASTERDATA_LOAD_ALL_COMPANY_TYPES")
};
