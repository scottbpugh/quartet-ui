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
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {Card, Tag, Intent} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {loadRules} from "../reducers/capture";
import "./RuleList.css";

class ServerRules extends Component {
  render() {
    const serverName = this.props.server.serverSettingName;
    const serverID = this.props.server.serverID;
    const {rules} = this.props;

    return (
      <Card className="bp3-elevation-4">
        <h5 className="bp3-heading">
          <button
            className="bp3-button right-aligned-elem bp3-intent-primary"
            onClick={e => {
              this.props.history.push(`/capture/add-rule/${serverID}/rule`);
            }}
          >
            <FormattedMessage id="plugins.capture.addRule" />
          </button>
          {serverName}
          {' '}
Rules
        </h5>
        <div />
        <div>
          <table className="pool-list-table paginated-list-table bp3-html-table bp3=small bp3-html-table-bordered bp3-html-table-striped">
            <thead>
              <tr>
                <th>
                  <FormattedMessage
                    id="plugins.capture.name"
                    defaultMessage="Name"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="plugins.capture.description"
                    defaultMessage="Description"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="plugins.capture.steps"
                    defaultMessage="Steps"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(rules) && rules.length > 0
                ? rules.map(rule => {
                  return (
                    <tr key={rule.id}>
                      <td>
                        {rule.name.charAt(0).toUpperCase()
                            + rule.name.slice(1)}
                      </td>
                      <td>
                        {rule.description}
                      </td>
                      <td>
                        {rule.steps.map(step => (
                          <Tag
                            key={step.name}
                            intent={Intent.PRIMARY}
                            className="step"
                          >
                              #
                            {step.order}
                            {' '}
                            {step.name}
                          </Tag>
                        ))}
                      </td>
                    </tr>
                  );
                })
                : null}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }
}

class _RuleList extends Component {
  componentDidMount() {
    this.props.loadRules(this.props.server);
  }

  render() {
    const {server, rules} = this.props;
    return (
      <RightPanel
        title={(
          <FormattedMessage
            id="plugins.capture.captureRules"
            defaultMessage="Capture Rules"
          />
)}
      >
        <div className="large-cards-container full-large">
          <ServerRules
            history={this.props.history}
            server={server}
            rules={rules}
          />
        </div>
      </RightPanel>
    );
  }
}

export const RuleList = connect(
  (state, ownProps) => {
    return {
      server: state.serversettings.servers[ownProps.match.params.serverID],
      rules: state.capture.servers
        ? state.capture.servers[ownProps.match.params.serverID].rules
        : []
    };
  },
  {loadRules}
)(_RuleList);
