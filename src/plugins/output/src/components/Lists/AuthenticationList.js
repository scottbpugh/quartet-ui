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
import {Menu, MenuItem, ContextMenu} from "@blueprintjs/core";
import {loadAuthenticationList} from "../../reducers/output";

const React = qu4rtet.require("react");
const {Component} = React;
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {connect} = qu4rtet.require("react-redux");
const {FormattedMessage} = qu4rtet.require("react-intl");
const {PaginatedList} = qu4rtet.require("./components/elements/PaginatedList");
const {DeleteObject} = qu4rtet.require("./components/elements/DeleteObject");

const AuthenticationListTableHeader = props => (
    <thead style={{textAlign: "center", verticalAlign: "middle"}}>
    <tr>
        <th>
            {" "}
            <FormattedMessage id="plugins.output.id"/>
        </th>
        <th>
            {" "}
            <FormattedMessage id="plugins.output.username"/>
        </th>
        <th>
            {" "}
            <FormattedMessage id="plugins.output.type"/>
        </th>
        <th>
            {" "}
            <FormattedMessage id="plugins.output.description"/>
        </th>
    </tr>
    </thead>
);

const AuthenticationListEntry = props => {
    const goTo = path => {
        props.history.push(path);
    };
    const goToPayload = goTo.bind(this, {
        pathname: `/output/${props.server.serverID}/add-authentication`,
        state: {defaultValues: props.entry, edit: true}
    });
    let deleteObj = DeleteObject ? (
        <DeleteObject
            entry={props.entry}
            operationId="output_authentication_info_delete"
            server={props.server}
            title={
                <FormattedMessage id="plugins.output.deleteAuthenticationConfirm"/>
            }
            body={
                <FormattedMessage id="plugins.output.deleteAuthenticationConfirmBody"/>
            }
            postDeleteAction={props.loadEntries}
        />
    ) : null;
    return (
        <tr key={props.entry.id}>
            <td onClick={goToPayload}>{props.entry.id}</td>
            <td onClick={goToPayload}>{props.entry.username}</td>
            <td onClick={goToPayload}>{props.entry.type}</td>
            <td onClick={goToPayload}>{props.entry.description}</td>
            <td>{deleteObj}</td>
        </tr>
    );
};

class _AuthenticationList extends Component {
    goTo = path => {
        return this.props.history.push(path);
    };
    renderContextMenu = (e) => {
        e.preventDefault();
        const {server, serverID, history} = this.props;
        ContextMenu.show (
            <Menu>
                <MenuItem
                    onClick={this.goTo.bind(
                        this,
                        `/output/${this.props.server.serverID}/add-authentication`
                    )}
                    text={pluginRegistry.getIntl().formatMessage({
                        id: "plugins.output.addAuthentication"
                    })}
                />
            </Menu>, {left: e.clientX, top: e.clientY}
        );
    };
    render() {
        const {
            server,
            authenticationList,
            loadAuthenticationList,
            count,
            next
        } = this.props;
        return (
            <RightPanel
                title={
                    <FormattedMessage
                        id="plugins.output.authenticationList"
                        defaultMessage="Authentication Info"
                    />
                }>
                <div className="large-cards-container full-large">
                    <PaginatedList
                        {...this.props}
                        listTitle={
                            <FormattedMessage id="plugins.output.authenticationList"/>
                        }
                        history={this.props.history}
                        loadEntries={loadAuthenticationList}
                        server={server}
                        entries={authenticationList}
                        entryClass={AuthenticationListEntry}
                        tableHeaderClass={AuthenticationListTableHeader}
                        count={count}
                        next={next}
                        context={this.renderContextMenu.bind(this)}
                    />

                    {/* keep prop name generic for entries */}
                </div>
            </RightPanel>
        );
    }
}

export const AuthenticationList = connect(
    (state, ownProps) => {
        const isServerSet = () => {
            return (
                state.output.servers &&
                state.output.servers[ownProps.match.params.serverID]
            );
        };
        return {
            server: state.serversettings.servers[ownProps.match.params.serverID],
            authenticationList: isServerSet()
                ? state.output.servers[ownProps.match.params.serverID]
                    .authenticationList
                : [],
            count: isServerSet()
                ? state.output.servers[ownProps.match.params.serverID].count
                : 0,
            next: isServerSet()
                ? state.output.servers[ownProps.match.params.serverID].next
                : null
        };
    },
    {loadAuthenticationList}
)(_AuthenticationList);
