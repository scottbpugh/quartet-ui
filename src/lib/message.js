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

export const showMessage = msg => {
  try {
    // for errors etc out of a component context.
    const intl = pluginRegistry.getIntl();
    if (msg.id) {
      msgToaster.show({
        message: intl.formatMessage({id: msg.id}, msg.values),
        intent: getIntent(msg.type)
      });
    } else if (msg.msg) {
      msgToaster.show({message: msg.msg, intent: getIntent(msg.type)});
    }
  } catch (e) {
    console.log(
      "an error occurred while attempting to display an error toast.",
      e
    );
  }
};
