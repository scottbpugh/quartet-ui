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

import RandomizedRegionForm from "./RandomizedRegionForm";
const React = qu4rtet.require("react");
const {Component} = React;
const {connect} = qu4rtet.require("react-redux");
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {Card} = qu4rtet.require("@blueprintjs/core");
const {FormattedMessage} = qu4rtet.require("react-intl");

class _AddRandomizedRegion extends Component {
  constructor(props) {
    super(props);
    this.currentServer = this.props.nr[this.props.match.params.serverID];
    for (let pool of this.currentServer.pools) {
      // match pool.
      if (pool.machine_name === this.props.match.params.pool) {
        this.currentPool = pool;
      }
    }
  }

  render() {
    let editMode =
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.editRegion;
    return (
      <RightPanel
        title={
          !editMode ? (
            <FormattedMessage id="plugins.numberRange.addRandomizedRegion" />
          ) : (
            <FormattedMessage id="plugins.numberRange.editRandomizedRegion" />
          )
        }>
        <div className="large-cards-container">
          <Card className="bp3-elevation-4 form-card">
            <h5>
              {!editMode ? (
                <FormattedMessage id="plugins.numberRange.addRandomizedRegion" />
              ) : (
                <FormattedMessage id="plugins.numberRange.editRandomizedRegion" />
              )}
            </h5>
            <RandomizedRegionForm
              server={this.currentServer.server}
              pool={this.currentPool}
              history={this.props.history}
            />
          </Card>
        </div>
      </RightPanel>
    );
  }
}

export const AddRandomizedRegion = connect((state, ownProps) => {
  return {
    servers: state.serversettings.servers,
    nr: state.numberrange.servers
  };
}, {})(_AddRandomizedRegion);
