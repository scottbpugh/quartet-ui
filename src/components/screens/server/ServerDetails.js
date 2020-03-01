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
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {saveServer, deleteServer} from "reducers/serversettings";
import {pluginRegistry} from "plugins/pluginRegistration";
import {DeleteDialog} from "components/elements/DeleteDialog";
import {Card, Button, Icon, Tag, Intent, Spinner, HTMLTable, ContextMenu} from "@blueprintjs/core";
import "./server-details.css";
import {ServerForm} from "./ServerForm";

class _ServerDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            confirmDeleteOpen: false
        };
    }

    componentDidMount() {
        // retrigger a schema fetch when mounting details.
        this.fetchAppList();
    }

    fetchAppList = (evt) => {
        let serverObject = pluginRegistry.getServer(this.props.server.serverID);
        if (serverObject) {
            serverObject.listApps();
        }
    };

    fetchAppListRefresh = evt => {
        let serverObject = pluginRegistry.getServer(this.props.server.serverID);
        if (serverObject) {
            serverObject.listApps(true);
        }
    };
    toggleEditMode = () => {
        this.setState({editMode: !this.state.editMode});
    };
    submitCallback = () => {
        // leave form on successful submit.
        this.setState({editMode: false});
    };
    toggleConfirmDelete = () => {
        this.setState({confirmDeleteOpen: !this.state.confirmDeleteOpen});
    };

    trashServer = () => {
        this.toggleConfirmDelete();
        ContextMenu.hide();
        this.props.history.push("/");
        this.props.deleteServer(this.props.server);
    };

    render() {
        const server = this.props.server;
        let serverObject = pluginRegistry.getServer(this.props.server.serverID);
        let services = serverObject
            ? serverObject.appList
                .filter(service => {
                    // remove empty string.
                    return service;
                })
                .map(service => {
                    return (
                        <tr key={service}>
                            <td>{service.toUpperCase()}</td>
                            <td style={{"text-align":"center"}} bgcolor="#6b8e23"><Icon icon="exchange"/></td>
                        </tr>
                    );
                })
            : [];
        return (
            <RightPanel title={<FormattedMessage id="app.servers.serverDetails"/>}>
                {serverObject ? (
                    <div className="cards-container">
                        <DeleteDialog
                            isOpen={this.state.confirmDeleteOpen}
                            title={
                                <FormattedMessage
                                    id="app.servers.deleteServer"
                                    values={{serverName: server.serverSettingName}}
                                />
                            }
                            body={<FormattedMessage id="app.servers.deleteServerConfirm"/>}
                            toggle={this.toggleConfirmDelete.bind(this)}
                            deleteAction={this.trashServer.bind(this)}
                        />
                        <Card className="bp3-elevation-1">
                            <h5 className="bp3-heading">
                                <Button
                                    onClick={this.toggleConfirmDelete}
                                    className="bp3-minimal delete-button"
                                    icon="trash">
                                </Button>
                                Settings
                                <Button
                                    onClick={this.toggleEditMode}
                                    className="bp3-intent-primary add-incard-button"
                                    icon="edit">
                                    Edit
                                </Button>
                            </h5>
                            {this.state.editMode ? (
                                <div className="form-card">
                                    <ServerForm
                                        defaultValues={serverObject.toJSON()}
                                        formData={serverObject.getFormStructure()}
                                        saveButtonMsg={
                                            <FormattedMessage id="app.servers.updateServer"/>
                                        }
                                        submitCallback={this.submitCallback}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <HTMLTable
                                        className="paginated-list-table"
                                        bordered={true}
                                        condensed={true}
                                        interactive={false}
                                        striped={true}
                                    >
                                        <thead>
                                        <tr>
                                            <th colSpan="2">Connection Details</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {serverObject.getArrayFields()
                                            .map(elem => {
                                                return (
                                                    <tr key={elem.name}>
                                                        <td>{elem.name}</td>
                                                        <td>{"" + elem.value}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </HTMLTable>
                                </div>
                            )}
                        </Card>
                        <Card className="bp3-elevation-1">
                            <h5 className="bp3-heading">
                                Installed APIs{" "}
                                <Button className="add-incard-button"
                                        onClick={this.fetchAppListRefresh}
                                        icon="refresh"
                                />
                            </h5>

                            {services.length > 0 ? (
                                <HTMLTable
                                    striped={services.length > 0}
                                    bordered={true}
                                    condensed={true}
                                    interactive={false}
                                >
                                    <tbody>
                                    {services}
                                    </tbody>
                                </HTMLTable>
                            ) : (
                                <div style={{"margin":"10px"}}>
                                    <Spinner
                                        intent={Intent.PRIMARY}
                                        size={100}
                                    />
                                </div>

                            )}
                        </Card>
                    </div>
                ) : null}
            </RightPanel>
        );
    }
}

export var ServerDetails = connect(
    (state, ownProps) => ({
        server: state.serversettings.servers[ownProps.match.params.serverID]
    }),
    {
        saveServer,
        deleteServer
    }
)(_ServerDetails);
