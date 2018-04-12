import {createAction} from "redux-actions";

export default {
  loadEntries: createAction("EPCIS_LOAD_ENTRIES"),
  loadEvents: createAction("EPCIS_LOAD_EVENTS")
};
