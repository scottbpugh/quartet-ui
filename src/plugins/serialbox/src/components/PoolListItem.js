import {deleteAPool, setAllocation} from "../reducers/numberrange";
const {showMessage} = qu4rtet.require("./lib/message");
const React = qu4rtet.require("react");
const {Component} = React;
const {connect} = qu4rtet.require("react-redux");
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");
import {pluginRegistry} from "../../../pluginRegistration";

const classNames = qu4rtet.require("classnames");
const intl = pluginRegistry.getIntl()
import {DeleteDialog} from "components/elements/DeleteDialog";

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

class PoolListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAllocationOpen: false,
            alloc: 0,
            isConfirmDeleteOpen: false,
            exportType: "json"
        };
    }

    setAllocation = evt => {
        evt.preventDefault();
        const pool = this.props.entry;
        const serverID = this.props.server.serverID;
        this.props.setAllocation(
            pluginRegistry.getServer(serverID),
            pool,
            this.state.alloc,
            this.state.exportType
        );
        this.toggleAllocation();
    };

    toggleAllocation = () => {
        let pool = this.props.entry;
        let serverID = this.props.server.serverID;
        this.setState({isAllocationOpen: !this.state.isAllocationOpen});
    };

    getAllowedRegionTypes = () => {
        const pool = this.props.entry;
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

    poolHasRandom = () => {
        const pool = this.props.entry;
        return pool.randomizedregion_set !== undefined;
    };
    poolHasListBased = () => {
        const pool = this.props.entry;
        return pool.listbasedregion_set !== undefined;
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
            state: {defaultValues: this.props.entry, editPool: true}
        });
    };

    renderContextMenu() {
        const serverID = this.props.server.serverID;
        const pool = this.props.entry;
        const {sequential, randomized, listBased} = this.getAllowedRegionTypes(pool);
        const intl = pluginRegistry.getIntl();
        console.info('Rendering menu for pool ' + pool.readable_name);
        return (
            <Menu>
                <ButtonGroup className="context-menu-control" minimal={true}>
                    <Button small={true} onClick={() => this.goToEdit(pool)} iconName="edit"/>
                    <Button
                        small={true}
                        onClick={this.toggleConfirmDelete}
                        iconName="trash"
                    />
                </ButtonGroup>
                <MenuDivider title={pool.readable_name}/>
                <MenuDivider/>
                {sequential ? (
                    <MenuItem
                        onClick={this.goTo.bind(
                            this,
                            `/number-range/add-region/${serverID}/${pool.machine_name}`
                        )}
                        text={`${intl.formatMessage({
                            id: "plugins.numberRange.addSequentialRegion"
                        })}`}
                    />
                ) : null}
                {randomized ? (
                    <MenuItem
                        onClick={this.goTo.bind(
                            this,
                            `/number-range/add-randomized-region/${serverID}/${
                                pool.machine_name
                            }`
                        )}
                        text={`${intl.formatMessage({
                            id: "plugins.numberRange.addRandomizedRegion"
                        })}`}
                    />
                ) : null}
                {listBased ? (
                    <MenuItem
                        onClick={this.goTo.bind(
                            this,
                            `/number-range/add-list-based-region/${serverID}/${
                                pool.machine_name
                            }`
                        )}
                        text={`${intl.formatMessage({
                            id: "plugins.numberRange.addListBasedRegion"
                        })}`}
                    />
                ) : null}
                <MenuItem
                    onClick={this.toggleAllocation}
                    text={intl.formatMessage({
                        id: "plugins.numberRange.allocateButton"
                    })}
                />
            </Menu>
        );
    }

    allocChange = evt => {
        this.setState({alloc: evt.target.value});
    };
    toggleConfirmDelete = evt => {
        this.setState({isConfirmDeleteOpen: !this.state.isConfirmDeleteOpen});
    };
    trashPool = evt => {
        const serverID = this.props.server.serverID;
        const serverObject = pluginRegistry.getServer(serverID);
        this.toggleConfirmDelete();
        ContextMenu.hide();
        this.props.deleteAPool(serverObject, this.props.entry);
        this.props.history.push(`/number-range/pools/${serverID}`);
    };
    handleExportChange = evt => {
        this.setState({exportType: evt.target.value});
    };

    render() {
        const serverID = this.props.server.serverID;
        const pool = this.props.entry;
        return (
            <tr key={pool.machine_name}
                onContextMenu={
                    () => this.renderContextMenu()
                }
            >
                <td>
                    <FormattedDate
                        value={pool.created_date}
                        day="numeric"
                        month="long"
                        year="numeric"
                    />
                </td>
                <td>{pool.readable_name}</td>
                <td>
                    <Link
                        to={`/number-range/edit-pool/${serverID}/${pool.machine_name}?returnpage=${this.props.page}`}>
                        {pool.machine_name}
                    </Link>
                </td>
                <td>
                    {pool.active ? (
                        <FormattedMessage
                            id="plugins.numberRange.active"
                            defaultMessage="active"
                        />
                    ) : (
                        <FormattedMessage
                            id="plugins.numberRange.inactive"
                            defaultMessage="inactive"
                        />
                    )}
                </td>
                <td>
                    <FormattedNumber value={pool.request_threshold}/>
                </td>
                <td>
                    <Link
                        to={`/number-range/region-detail/${serverID}/${pool.machine_name}/`}>
                        {this.props.regionNumber}{" "}
                        <FormattedMessage
                            id="plugins.numberRange.regions"
                            defaultMessage="regions"
                        />
                    </Link>
                </td>
                <Dialog
                    isOpen={this.state.isAllocationOpen}
                    onClose={this.toggleAllocation}
                    title={`${intl.formatMessage({
                        id: "plugins.numberRange.allocateButton"
                    })} ${pool.readable_name}`}
                    className={classNames({
                        "pt-dark": this.props.theme.startsWith("dark")
                    })}>
                    <div className="pt-dialog-body">
                        <form onSubmit={this.setAllocation} className="mini-form">
                            <input
                                placeholder="allocate"
                                className="pt-input"
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
                            <button type="submit" className="pt-button">
                                <FormattedMessage id="plugins.numberRange.allocateButton"/>
                            </button>
                        </form>
                    </div>
                </Dialog>
                <DeleteDialog
                    isOpen={this.state.isConfirmDeleteOpen}
                    title={
                        <FormattedMessage
                            id="plugins.numberRange.deletePool"
                            values={{poolName: pool.readable_name}}
                        />
                    }
                    body={
                        <FormattedMessage id="plugins.numberRange.deletePoolConfirm"/>
                    }
                    toggle={this.toggleConfirmDelete.bind(this)}
                    deleteAction={this.trashPool.bind(this)}
                />
            </tr>
        );
    }
}

ContextMenuTarget(PoolListItem);

const mapStateToProps = state => ({
    theme: state.layout.theme
});

export default connect(
    mapStateToProps,
    {setAllocation, deleteAPool}
)(PoolListItem);

