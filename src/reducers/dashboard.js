import {handleActions} from "redux-actions";
import {getNotifications} from "../lib/dashboardServices";
import actions from "../actions/dashboard";

export const fetchNotifications = () => {
  return dispatch => {
    getNotifications().then(notifications =>
      dispatch(loadNotifications(notifications))
    );
  };
};

export const loadNotifications = notifications => ({
  type: actions.loadNotifications,
  payload: {notifications: notifications}
});

export default handleActions(
  {
    [actions.loadNotifications]: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    }
  },
  {}
);
