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
import React, {Component} from "react";
import {Card} from "@blueprintjs/core";
import What from "./EventDetailTable/What";
import When from "./EventDetailTable/When";
import Where from "./EventDetailTable/Where";
import Why from "./EventDetailTable/Why";

export class EventDetailTable extends Component {
  getObjectType = currentEntry => {
    try {
      let key = Object.keys(currentEntry);
      return key[0];
    } catch (e) {
      return null;
    }
  };
  goTo = path => {
    this.props.history.push(path);
  };

  render() {
    const {currentEntry, serverID} = this.props;
    let objectType = this.getObjectType(currentEntry);
    let isReady = () => {
      return currentEntry && currentEntry[objectType];
    };
    return (
      <div id={isReady() ? currentEntry[objectType].eventID : null}>
        {isReady() ? (
          <div className={this.props.className}>
            <Card>
              <What
                currentEntry={currentEntry}
                objectType={objectType}
                goTo={this.goTo.bind(this)}
                serverID={serverID}
              />
            </Card>
            <Card>
              <When
                currentEntry={currentEntry}
                objectType={objectType}
                goTo={this.goTo.bind(this)}
                serverID={serverID}
              />
            </Card>
            <Card>
              <Where
                currentEntry={currentEntry}
                objectType={objectType}
                goTo={this.goTo.bind(this)}
                serverID={serverID}
              />
            </Card>
            <Card>
              <Why
                currentEntry={currentEntry}
                objectType={objectType}
                goTo={this.goTo.bind(this)}
                serverID={serverID}
              />
            </Card>
          </div>
        ) : null}
      </div>
    );
  }
}
