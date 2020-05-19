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
import {Card, Button, Tag} from "@blueprintjs/core";
import {
  setEnablePlugin,
  setDisablePlugin,
  fetchRemotePlugins
} from "reducers/plugins";
import {connect} from "react-redux";
import "./PluginList.css";
import {updateMessages} from "reducers/locales";

class Plugin extends Component {
  constructor(props) {
    super(props);
    this.state = {runtimeVersion: this.getVersionIfInstalled()};
  }
  componentDidMount() {
    this.setState({runtimeVersion: this.getVersionIfInstalled()});
  }
  componentWillReceiveProps(nextProps) {
    this.setState({runtimeVersion: this.getVersionIfInstalled()});
  }
  handleEnable = async evt => {
    let pluginModule = await window.qu4rtet.getPluginModule(
      this.props.pluginEntry
    );
    pluginModule.enablePlugin();
    this.props.setEnablePlugin({
      [this.props.pluginName]: {...this.props.pluginEntry}
    });
    this.props.updateMessages(this.props.locale);
  };
  getVersionIfInstalled = () => {
    try {
      if (this.props.pluginEntry.packagePath) {
        return qu4rtet.require(
          `${qu4rtet.pluginPath}/${
            this.props.pluginEntry.packagePath
          }/package.json`
        ).version;
      }
    } catch (e) {
      // we don't care if it's not available.
      return null;
    }
  };
  handleDisable = async evt => {
    let pluginModule = await window.qu4rtet.getPluginModule(
      this.props.pluginEntry
    );
    pluginModule.disablePlugin();
    this.props.setDisablePlugin({
      [this.props.pluginName]: {...this.props.pluginEntry}
    });
  };
  render() {
    return (
      <Card className="bp3-elevation-1">
        <h5 className="bp3-heading">
          {this.props.pluginEntry.readableName}{" "}
          {this.props.pluginEntry.local ? (
            <Button
              icon="edit"
              
              className="bp3-button add-plugin-button bp3-intent-primary"
              onClick={this.handleEnable.bind(this)}>
              Edit
            </Button>
          ) : null}
          {!this.props.pluginEntry || !this.props.pluginEntry.enabled ? (
            <Button
              icon="add"
              className="bp3-button add-plugin-button bp3-intent-primary"
              onClick={this.handleEnable.bind(this)}>
              Enable
            </Button>
          ) : (
            <Button
              icon="remove"
              className="bp3-button add-plugin-button bp3-intent-primary"
              onClick={this.handleDisable.bind(this)}>
              Disable
            </Button>
          )}
        </h5>
        <div>
          {this.state.runtimeVersion ? (
            <Tag>{`version ${this.state.runtimeVersion}`}</Tag>
          ) : null}
          <div className="bp3-callout bp3-intent-primary bp3-callout-plugin">
            {this.props.pluginEntry.preview ? (
              <img
                className="plugin-screenshot"
                src={this.props.pluginEntry.preview}
                title={this.props.pluginEntry.readableName}
                alt={this.props.pluginEntry.readableName}
              />
            ) : null}
            <p>{this.props.pluginEntry.description}</p>
          </div>
        </div>
      </Card>
    );
  }
}

export class _PluginList extends Component {
  constructor(props) {
    super(props);
    this.state = {plugins: {}};
  }
  componentDidMount() {
    this.props.fetchRemotePlugins();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({plugins: nextProps.plugins});
  }
  render() {
    return (
      <RightPanel title={<formattedMessage id="app.nav.plugins" />}>
        <div className="cards-container">
          {this.state.plugins
            ? Object.keys(this.state.plugins).map(pluginName => {
                return (
                  <Plugin
                    {...this.props}
                    key={pluginName}
                    pluginName={pluginName}
                    pluginEntry={this.state.plugins[pluginName]}
                  />
                );
              })
            : null}
        </div>
      </RightPanel>
    );
  }
}

export const PluginList = connect(
  (state, ownProps) => {
    return {
      plugins: state.plugins.plugins,
      locale: state.intl.locale
    };
  },
  {setEnablePlugin, setDisablePlugin, updateMessages, fetchRemotePlugins}
)(_PluginList);
