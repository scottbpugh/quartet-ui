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
import {RightPanel} from "components/layouts/Panels";
import {FormattedMesasge} from "react-intl";
import {Card, Button} from "@blueprintjs/core";
import {setEnablePlugin, setDisablePlugin} from "reducers/plugins";
import {connect} from "react-redux";
import "./PluginList.css";

class Plugin extends Component {
  getPluginModule = () => {
    // need to allow node-module imports in the future. But for
    // core plugins, path is relative.
    return require("plugins/" + this.props.plugin.initPath);
  };
  handleEnable = evt => {
    this.getPluginModule().enablePlugin();
    this.props.setEnablePlugin({
      [this.props.pluginName]: {...this.props.plugin}
    });
  };
  handleDisable = evt => {
    this.getPluginModule().disablePlugin();
    this.props.setDisablePlugin({
      [this.props.pluginName]: {...this.props.plugin}
    });
  };
  render() {
    return (
      <Card className="pt-elevation-4">
        <h5>
          {this.props.plugin.readableName}{" "}
          {!this.props.plugin.enabled ? (
            <Button
              iconName="pt-icon-add"
              className="pt-button add-plugin-button pt-intent-primary"
              onClick={this.handleEnable.bind(this)}>
              Enable
            </Button>
          ) : (
            <Button
              iconName="pt-icon-remove"
              className="pt-button add-plugin-button pt-intent-primary"
              onClick={this.handleDisable.bind(this)}>
              Disable
            </Button>
          )}
        </h5>

        <div className="pt-callout pt-intent-primary pt-callout-plugin">
          <img
            className="plugin-screenshot"
            src={this.props.plugin.preview}
            title={this.props.plugin.readableName}
          />
          <p>{this.props.plugin.description}</p>
        </div>
      </Card>
    );
  }
}

export class _PluginList extends Component {
  render() {
    return (
      <RightPanel title={<formattedMessage id="app.nav.plugins" />}>
        <div className="cards-container">
          {Object.keys(this.props.plugins).map(pluginName => {
            return (
              <Plugin
                setEnablePlugin={this.props.setEnablePlugin}
                setDisablePlugin={this.props.setDisablePlugin}
                pluginName={pluginName}
                plugin={this.props.plugins[pluginName]}
              />
            );
          })}
        </div>
      </RightPanel>
    );
  }
}

export const PluginList = connect(
  (state, ownProps) => {
    return {
      plugins: state.plugins.plugins
    };
  },
  {setEnablePlugin, setDisablePlugin}
)(_PluginList);
