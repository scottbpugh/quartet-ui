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
import actions from "../actions/layout";

export const initialData = () => {
  return {
    pageTitle: "Main"
  };
};

export const loadPageTitle = title => {
  return dispatch => {
    return dispatch({type: actions.loadPageTitle, payload: title});
  };
};

export default handleActions(
  {
    [actions.loadPageTitle]: (state, action) => {
      return {
        ...state,
        pageTitle: action.payload
      };
    }
  },
  {}
);
