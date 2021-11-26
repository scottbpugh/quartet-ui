const {createAction} = qu4rtet.require("redux-actions");

export default {
  loadPools: createAction("NUMBER_RANGE_LOAD_POOLS"),
  loadRegion: createAction("NUMBER_RANGE_LOAD_REGION"),
  loadRegions: createAction("NUMBER_RANGE_LOAD_REGIONS"),
  allocate: createAction("NUMBER_RANGE_ALLOCATE"),
  setLoadingStatus: createAction("SET_LOADING_STATUS")
};
