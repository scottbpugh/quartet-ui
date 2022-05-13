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

import {Position, Toaster, Intent} from "@blueprintjs/core";
import {pluginRegistry} from "plugins/pluginRegistration";
import stringHash from "string-hash";

const MINIMUM_EXPIRE = 7000;

const msgToaster = Toaster.create({
  className: "my-toaster",
  position: Position.BOTTOM_RIGHT
});

const getIntent = type => {
  switch (type) {
    case "success":
      return Intent.SUCCESS;
    case "danger":
    case "error":
      return Intent.DANGER;
    case "warning":
      return Intent.WARNING;
    default:
      return Intent.PRIMARY;
  }
};

const _msgHashMap = {};

const showMessageNoRepeat = (toastMessage, expires_in = MINIMUM_EXPIRE) => {
  let msgHash = stringHash(JSON.stringify(toastMessage));
  let timestamp = new Date().getTime();
  if (msgHash in _msgHashMap && _msgHashMap[msgHash].expires > timestamp) {
    // don't show msg and update the expiration to prevent the same message
    // over and over.
    _msgHashMap[msgHash].expires = timestamp + expires_in;
    return;
  }
  _msgHashMap[msgHash] = {expires: timestamp + expires_in};
  msgToaster.show(toastMessage);
};

export const showMessage = msg => {
  try {
    // for errors etc out of a component context.
    const intl = pluginRegistry.getIntl();
    if (msg.id) {
      showMessageNoRepeat(
        {
          message: intl.formatMessage({id: msg.id}, msg.values),
          intent: getIntent(msg.type)
        },
        msg.expires_in || MINIMUM_EXPIRE
      );
    } else if (msg.msg) {
      //let formatMsg = typeof msg.msg === "object" ? JSON.stringify(msg.msg) : msg.msg;
      showMessageNoRepeat(
        {message: msg.msg, intent: getIntent(msg.type)},
        msg.expires_in || MINIMUM_EXPIRE
      );
    }
  } catch (e) {
    console.log(
      "an error occurred while attempting to display an error toast.",
      e
    );
  }
};

window.qu4rtet.exports("lib/message", this);
