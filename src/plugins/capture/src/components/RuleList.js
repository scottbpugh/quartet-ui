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
import {DeleteDialog} from "../../../../components/elements/DeleteDialog";
import {RightPanel} from "components/layouts/Panels";
import {Card, Tag, Intent, HTMLTable, Button} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {loadRules, deleteRule} from "../reducers/capture";
import "./RuleList.css";

class ServerRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteDialogOpen: false,
            currentRule: null
        }
    }

    closeDialog = () => {
        this.setState({deleteDialogOpen: false})
    }

    editRule(ruleID) {
        console.info('ruleID' + ruleID);
        this.props.history.push(`/capture/add-rule/${this.props.server.serverID}/rule/${ruleID}/?edit=true`)
    }

    promptDeleteRule(rule){
        this.setState({currentRule: rule, deleteDialogOpen: true});
    }

    deleteRule(){
        try{
            this.props.deleteRule(this.props.server, this.state.currentRule)
        }finally{
            this.setState({deleteDialogOpen: false});
        }
    }

    render() {
        const serverName = this.props.server.serverSettingName;
        const serverID = this.props.server.serverID;
        const {rules} = this.props;

        return (
            <Card className="bp3-elevation-1">
                <h5 className="bp3-heading">
                    <button
                        className="bp3-button right-aligned-elem bp3-intent-primary"
                        onClick={e => {
                            this.props.history.push(`/capture/add-rule/${serverID}/rule`);
                        }}
                    >
                        <FormattedMessage id="plugins.capture.addRule"/>
                    </button>
                    {serverName}
                    {' '}
                    Rules
                </h5>
                <div/>
                <div>
                    <HTMLTable className="pool-list-table paginated-list-table"
                               bordered={true}
                               condensed={true}
                               interactive={true}
                               striped={true}
                    >
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
                            <th>
                                <FormattedMessage
                                    id="plugins.capture.deleteRule"
                                    defaultMessage="Delete"/>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(rules) && rules.length > 0
                            ? rules.map(rule => {
                                return (
                                    <tr key={rule.id}>
                                        <td onClick={() => this.editRule(rule.id)}>
                                            {rule.name.charAt(0).toUpperCase()
                                            + rule.name.slice(1)}
                                        </td>
                                        <td onClick={() => this.editRule(rule.id)}>
                                            {rule.description}
                                        </td>
                                        <td onClick={() => this.editRule(rule.id)}>
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
                                        <td>
                                            <Button icon="trash"
                                                    minimal={true}
                                                    onClick={() => this.promptDeleteRule(rule)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                            : null}
                        </tbody>
                    </HTMLTable>
                </div>
                <DeleteDialog
                    isOpen={this.state.deleteDialogOpen}
                    title={<FormattedMessage id="plugins.capture.deleteRule" />}
                    body={<FormattedMessage id="plugins.capture.deleteRuleConfirm" />}
                    toggle={this.closeDialog.bind(this)}
                    deleteAction={this.deleteRule.bind(this)}
                />
            </Card>
        );
    }
}

class _RuleList extends Component {
    // to load rules use : 
    // this was removed from componentDidMount to prevent 
    
    componentDidMount(){
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
                        {...this.props}
                        history={this.props.history}
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
    {loadRules, deleteRule}
)(_RuleList);
