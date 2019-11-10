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

import {loadPools, loadResponseRules} from "../reducers/numberrange";
import PoolListItem from "./PoolListItem";
import Loader from "../../../../components/Loader";
const React = qu4rtet.require("react");
const {Component} = React;
const {connect} = qu4rtet.require("react-redux");
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
const {
    Card,
    Menu,
    MenuItem,
    MenuDivider,
    Dialog,
    Button,
    ButtonGroup,
    ContextMenuTarget,
    ContextMenu,
    RadioGroup,
    Radio
} = qu4rtet.require("@blueprintjs/core")
const {FormattedMessage, FormattedDate, FormattedNumber} = qu4rtet.require(
    "react-intl"
);
const {Link} = qu4rtet.require("react-router-dom");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");

class ServerPools extends Component {
    getAllowedRegionTypes = (pool) => {
        if (pool.sequentialregion_set.length > 0) {
            return {sequential: true, randomized: false, listBased: false};
        } else if (this.poolHasRandom(pool) && pool.randomizedregion_set.length > 0) {
            return {sequential: false, randomized: true, listBased: false};
        } else if (this.poolHasListBased(pool) && pool.listbasedregion_set.length > 0) {
            return {sequential: false, randomized: false, listBased: true};
        }
        return {
            sequential: true,
            randomized: this.poolHasRandom(pool),
            listBased: this.poolHasListBased(pool)
        };
    };

    poolHasRandom = (pool) => {
        pool.randomizedregion_set !== undefined;
    };
    poolHasListBased = (pool) => {
        pool.listbasedregion_set !== undefined;
    };
    goTo = path => {
        this.props.history.push(path);
    };
    goToEdit = (evt, pool) => {
        ContextMenu.hide();
        this.props.history.push({
            pathname: `/number-range/edit-pool/${this.props.server.serverID}/${
                pool.machine_name
            }`,
            state: {defaultValues: this.props.pool, editPool: true}
        });
    };

    render() {
        let serverName = this.props.server.serverSettingName;
        let serverID = this.props.server.serverID;
        return (
            <Card className="bp3-elevation-4">
                <h5>
                    <button
                        className="bp3-button add-pool-button bp3-intent-primary"
                        onClick={e => {
                            this.props.history.push(`/number-range/add-pool/${serverID}/`);
                        }}>
                        <FormattedMessage id="plugins.numberRange.addPool"/>
                    </button>
                    {serverName}
                </h5>
                <div/>
                <div>
                    <table className="pool-list-table bp3-table bp3-bordered bp3-striped">
                        <thead>
                        <tr>
                            <th>
                                <FormattedMessage
                                    id="plugins.numberRange.createdOn"
                                    defaultMessage="Created on"
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id="plugins.numberRange.readableName"
                                    defaultMessage="Readable Name"
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id="plugins.numberRange.machineName"
                                    defaultMessage="Machine Name"
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id="plugins.numberRange.status"
                                    defaultMessage="Status"
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id="plugins.numberRange.requestThreshold"
                                    defaultMessage="Request Threshold"
                                />
                            </th>
                            <th>
                                <FormattedMessage
                                    id="plugins.numberRange.regions"
                                    defaultMessage="Regions"
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(this.props.pools) && this.props.pools.length > 0
                            ? this.props.pools.map(pool => {
                                let regionNumber = 0;
                                if (Number(pool.sequentialregion_set.length)) {
                                    regionNumber = Number(pool.sequentialregion_set.length);
                                }
                                if (
                                    pool.randomizedregion_set &&
                                    Number(pool.randomizedregion_set.length)
                                ) {
                                    regionNumber += Number(pool.randomizedregion_set.length);
                                }
                                if (
                                    pool.listbasedregion_set &&
                                    Number(pool.listbasedregion_set.length)
                                ) {
                                    regionNumber += Number(pool.listbasedregion_set.length);
                                }
                                return (<PoolListItem regionNumber={regionNumber} pool={pool} {...this.props} />)
                            }) : null}
                        </tbody>
                    </table>
                </div>
            </Card>
        );
    }
}


class _PoolList extends Component {
    componentDidMount() {
        let {server} = this.props;
        this.props.loadPools(pluginRegistry.getServer(server.serverID));
    }

    render() {
        let {server, pools, loading} = this.props;
        if(!loading){
            return (
                <RightPanel
                    title={
                        <FormattedMessage
                            id="plugins.numberRange.numberRangePools"
                            defaultMessage="Number Range Pools"
                        />
                    }>
                    <div className="large-cards-container">
                        <ServerPools
                            history={this.props.history}
                            server={server}
                            pools={pools}
                        />
                    </div>
                </RightPanel>
            );
        }else{
            return(
                <RightPanel
                    title={
                        <FormattedMessage
                            id="plugins.numberRange.numberRangePools"
                            defaultMessage="Number Range Pools"
                        />
                    }>
                    <Loader/>
                </RightPanel>
            )
        }

    }
}

export var PoolList = connect(
    (state, ownProps) => {
        return {
            loading: state.numberrange.loading,
            server: state.serversettings.servers[ownProps.match.params.serverID],
            pools: state.numberrange.servers
                ? state.numberrange.servers[ownProps.match.params.serverID].pools
                : []
        };
    },
    {loadPools, loadResponseRules}
)(_PoolList);
