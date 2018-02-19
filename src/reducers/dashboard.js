// Copyright (c) 2018 Serial Lab
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

import {handleActions} from "redux-actions";
import {getNotifications} from "lib/dashboardServices";
import actions from "actions/dashboard";

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
