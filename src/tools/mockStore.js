// Copyright (c) 2018 SerialLab Corp.
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

import React from "react";
import renderer from "react-test-renderer";

import {IntlProvider} from "react-intl";
import {addLocaleData, FormattedMessage} from "react-intl";
import messages from "messages";
import en from "react-intl/locale-data/en";
import fr from "react-intl/locale-data/fr";
import {flattenMessages} from "lib/flattenMessages";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

addLocaleData([...en, ...fr]);
let locale = "en-US";
const middlewares = [thunk];

export const initialState = {
  dashboard: {notifications: []},
  serversettings: {},
  intl: {
    defaultLocale: "en-US",
    locale: locale,
    messages: flattenMessages(messages[locale])
  },
  layout: {pageTitle: {id: "app.nav.servers"}},
  plugins: {}
};

export const mockStore = configureStore(middlewares);

export const TestWrapper = ({children}) => {
  return (
    <IntlProvider locale={locale} messages={initialState.intl.messages}>
      {children}
    </IntlProvider>
  );
};
