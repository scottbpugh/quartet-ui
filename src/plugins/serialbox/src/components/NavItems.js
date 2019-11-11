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

import {deleteAPool, loadPools, setAllocation} from "../reducers/numberrange";

const React = qu4rtet.require("react");
const {Component} = React;
const {connect} = qu4rtet.require("react-redux");
const {
    Menu,
    MenuItem,
    MenuDivider,
    Dialog,
    Button,
    ButtonGroup,
    ContextMenu,
    ContextMenuTarget,
    RadioGroup,
    Radio
} = qu4rtet.require("@blueprintjs/core");
const {FormattedMessage} = qu4rtet.require("react-intl");
const {TreeNode} = qu4rtet.require("./components/layouts/elements/TreeNode");
const classNames = qu4rtet.require("classnames");
const {pluginRegistry} = qu4rtet.require("./plugins/pluginRegistration");
const {DeleteDialog} = qu4rtet.require("./components/elements/DeleteDialog");
const {withRouter} = qu4rtet.require("react-router");

class _PoolItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAllocationOpen: false,
            alloc: 0,
            isConfirmDeleteOpen: false,
            exportType: "json"
        };
    }

    poolHasRandom = () => {
        return this.props.pool.randomizedregion_set !== undefined;
    };
    poolHasListBased = () => {
        return this.props.pool.listbasedregion_set !== undefined;
    };
    goTo = path => {
        this.props.history.push(path);
    };
    toggleAllocation = () => {
        const {pool, serverID} = this.props;
        // redirect to pool regions if not already there.
        this.goTo(`/number-range/region-detail/${serverID}/${pool.machine_name}`);
        this.setState({isAllocationOpen: !this.state.isAllocationOpen});
    };
    getAllowedRegionTypes = () => {
        const {pool} = this.props;
        if (pool.sequentialregion_set.length > 0) {
            return {sequential: true, randomized: false, listBased: false};
        } else if (this.poolHasRandom() && pool.randomizedregion_set.length > 0) {
            return {sequential: false, randomized: true, listBased: false};
        } else if (this.poolHasListBased() && pool.listbasedregion_set.length > 0) {
            return {sequential: false, randomized: false, listBased: true};
        }
        return {
            sequential: true,
            randomized: this.poolHasRandom(),
            listBased: this.poolHasListBased()
        };
    };
    goToEdit = () => {
        let {pool} = this.props;
        ContextMenu.hide();
        this.props.history.push({
            pathname: `/number-range/edit-pool/${this.props.serverID}/${
                pool.machine_name
            }`,
            state: {defaultValues: this.props.pool, editPool: true}
        });
    };

    renderContextMenu(e) {
        alert('test');
    }

    // renderContextMenu(e) {
    //   console.info("render context menu called.")
    //     const {serverID, pool} = this.props;
    //     const {sequential, randomized, listBased} = this.getAllowedRegionTypes();
    //     e.preventDefault();
    //     ContextMenu.show(
    //         <Menu>
    //             <ButtonGroup className="context-menu-control" minimal={true}>
    //                 <Button small={true} onClick={this.goToEdit} icon="edit"/>
    //                 <Button
    //                     small={true}
    //                     onClick={this.toggleConfirmDelete}
    //                     icon="trash"
    //                 />
    //             </ButtonGroup>
    //             <MenuDivider title={pool.readable_name}/>
    //             <MenuDivider/>
    //             {sequential ? (
    //                 <MenuItem
    //                     onClick={this.goTo.bind(
    //                         this,
    //                         `/number-range/add-region/${serverID}/${pool.machine_name}`
    //                     )}
    //                     text={`${this.props.intl.formatMessage({
    //                         id: "plugins.numberRange.addSequentialRegion"
    //                     })}`}
    //                 />
    //             ) : null}
    //             {randomized ? (
    //                 <MenuItem
    //                     onClick={this.goTo.bind(
    //                         this,
    //                         `/number-range/add-randomized-region/${serverID}/${
    //                             pool.machine_name
    //                         }`
    //                     )}
    //                     text={`${this.props.intl.formatMessage({
    //                         id: "plugins.numberRange.addRandomizedRegion"
    //                     })}`}
    //                 />
    //             ) : null}
    //             {listBased ? (
    //                 <MenuItem
    //                     onClick={this.goTo.bind(
    //                         this,
    //                         `/number-range/add-list-based-region/${serverID}/${
    //                             pool.machine_name
    //                         }`
    //                     )}
    //                     text={`${this.props.intl.formatMessage({
    //                         id: "plugins.numberRange.addListBasedRegion"
    //                     })}`}
    //                 />
    //             ) : null}
    //             <MenuItem
    //                 onClick={this.toggleAllocation}
    //                 text={this.props.intl.formatMessage({
    //                     id: "plugins.numberRange.allocateButton"
    //                 })}
    //             />
    //         </Menu>, {left: e.clientX, top: e.clientY}
    //     );
    // }

    setAllocation = evt => {
        evt.preventDefault();
        const {pool, serverID} = this.props;
        this.props.setAllocation(
            pluginRegistry.getServer(serverID),
            pool,
            this.state.alloc,
            this.state.exportType
        );
        this.toggleAllocation();
    };
    allocChange = evt => {
        this.setState({alloc: evt.target.value});
    };
    toggleConfirmDelete = () => {
        this.setState({isConfirmDeleteOpen: !this.state.isConfirmDeleteOpen});
    };
    trashRegion = () => {
        const {serverID, pool, deleteAPool} = this.props;
        const serverObject = pluginRegistry.getServer(serverID);
        this.toggleConfirmDelete();
        ContextMenu.hide();
        deleteAPool(serverObject, pool);
        this.props.history.push(`/number-range/pools/${serverObject.serverID}`);
    };
    handleExportChange = evt => {
        this.setState({exportType: evt.target.value});
    };

    render() {
        const {pool, serverID, key} = this.props;
        return (
            <TreeNode
                onContextMenu={this.renderContextMenu.bind(this)}
                key={key}
                path={`/number-range/region-detail/${serverID}/${pool.machine_name}`}
                nodeType="pool"
                active={this.state.active}
                collapsed={this.state.collapsed}
                depth={this.props.depth}
                childrenNodes={[]}>
                <Dialog
                    isOpen={this.state.isAllocationOpen}
                    onClose={this.toggleAllocation}
                    title={`${this.props.intl.formatMessage({
                        id: "plugins.numberRange.allocateButton"
                    })} ${pool.readable_name}`}
                    className={classNames({
                        "bp3-dark": !!this.props.theme.startsWith("dark")
                    })}>
                    <div className="bp3-dialog-body">
                        <form onSubmit={this.setAllocation} className="mini-form">
                            <input
                                placeholder="allocate"
                                className="bp3-input"
                                type="number"
                                defaultValue={1}
                                value={this.state.alloc}
                                onChange={this.allocChange}
                                min={1}
                                max={Number(pool.request_threshold)}
                                style={{width: 200}}
                            />
                            <div style={{marginTop: "30px", marginBottom: "20px"}}>
                                <RadioGroup
                                    inline={true}
                                    label="Export Type"
                                    onChange={this.handleExportChange}
                                    selectedValue={this.state.exportType}>
                                    <Radio label="JSON" value="json"/>
                                    <Radio label="CSV" value="csv"/>
                                    <Radio label="XML" value="xml"/>
                                </RadioGroup>
                            </div>
                            <button type="submit" className="bp3-button">
                                <FormattedMessage id="plugins.numberRange.allocateButton"/>
                            </button>
                        </form>
                    </div>
                </Dialog>
                <DeleteDialog
                    isOpen={this.state.isConfirmDeleteOpen}
                    title={
                        <FormattedMessage
                            id="plugins.numberRange.deleteRegion"
                            values={{regionName: pool.readable_name}}
                        />
                    }
                    body={
                        <FormattedMessage id="plugins.numberRange.deleteRegionConfirm"/>
                    }
                    toggle={this.toggleConfirmDelete.bind(this)}
                    deleteAction={this.trashRegion.bind(this)}
                />
                {pool.readable_name}
            </TreeNode>
        );
    }
}

const PoolItem = connect(
    state => {
        return {
            currentRegions: state.numberrange.currentRegions,
            servers: state.serversettings.servers,
            currentPath: state.layout.currentPath,
            theme: state.layout.theme
        };
    },
    {setAllocation, deleteAPool}
)(withRouter(_PoolItem));

export const NavItems = (pools, serverID, intl) => {
    if (!Array.isArray(pools)) {
        return [];
    }
    return pools.map(pool => {
        // passing intl down to use formatMessage and translate...
        return (
            <PoolItem key={pool.name} pool={pool} serverID={serverID} intl={intl}/>
        );
    });
};

export class _NavPluginRoot extends Component {
    static get PLUGIN_COMPONENT_NAME() {
        return "NumberRangeNavRoot";
    }

    serverHasSerialbox() {
        return pluginRegistry
            .getServer(this.props.serverID)
            .appList.includes("serialbox");
    }

    goTo = path => {
        this.props.history.push(path);
    };

    componentDidMount() {
        if (this.props.server && this.serverHasSerialbox()) {
            this.props.loadPools(pluginRegistry.getServer(this.props.serverID));
        }
    }

    renderContextMenu = (e) => {
        if (e.which === 3) {
            const {server, serverID} = this.props;
            e.preventDefault();
            ContextMenu.show(
                <Menu>
                    <MenuDivider title={server.serverSettingName}/>
                    <MenuDivider/>
                    <MenuItem
                        onClick={this.goTo.bind(this, `/number-range/add-pool/${serverID}`)}
                        text={this.props.intl.formatMessage({
                            id: "plugins.numberRange.addPool"
                        })}
                    />
                </Menu>, {left: e.clientX, top: e.clientY}
            );
        }
        alert(e.which);
        return e;
    };

    render() {
        const {serverID} = this.props;
        const showMenu = this.renderContextMenu.bind(this)
        if (this.props.server && this.serverHasSerialbox()) {
            return (
                <TreeNode
                    serverID={serverID}
                    nodeData={showMenu}
                    nodeType="plugin"
                    depth={this.props.depth}
                    childrenNodes={[]}
                    path={`/number-range/pools/${serverID}`}>
                    <FormattedMessage id="plugins.numberRange.navItemsTitle"/>
                </TreeNode>
            );
        } else {
            return (
                <TreeNode depth={this.props.depth} childrenNodes={[]}>
                    <i>
                        <FormattedMessage id="plugins.numberRange.noNumberRangeFound"/>
                    </i>
                </TreeNode>
            );
        }
    }
}

ContextMenuTarget(_NavPluginRoot);
export const NavPluginRoot = connect(
    (state, ownProps) => {
        return {
            server: state.serversettings.servers[ownProps.serverID],
            pools:
                state.numberrange.servers &&
                state.numberrange.servers[ownProps.serverID]
                    ? state.numberrange.servers[ownProps.serverID].pools
                    : [],
            currentPath: state.layout.currentPath
        };
    },
    {loadPools}
)(withRouter(_NavPluginRoot));
