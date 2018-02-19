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
import actions from "actions/locales";
import {updateIntl} from "react-intl-redux";
import {flattenMessages} from "lib/flattenMessages";
import messages from "messages";
import {pluginRegistry} from "plugins/pluginRegistration";

export const updateMessages = locale => {
  let coreMessages = {...messages};
  let newMessages = pluginRegistry.getMessages();
  for (let language in newMessages) {
    if (language in messages) {
      coreMessages[language].plugins = {
        ...coreMessages[language].plugins,
        ...newMessages[language].plugins
      };
      console.log("plugin now", coreMessages[language].plugins);
    } else {
      coreMessages[language] = {plugins: {...newMessages[language].plugins}};
    }
  }
  console.log("Core Messages are now", coreMessages);
  return dispatch => {
    console.log("Dispatch triggered");
    return dispatch(
      updateIntl({
        locale: locale,
        messages: flattenMessages(coreMessages[locale])
      })
    );
  };
};

export const switchLocale = newLocale => {
  return dispatch => {
    return dispatch(
      updateIntl({
        locale: newLocale,
        messages: flattenMessages(messages[newLocale])
      })
    );
  };
};

export default handleActions(
  {
    [actions.switchLocale]: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    }
  },
  {}
);
