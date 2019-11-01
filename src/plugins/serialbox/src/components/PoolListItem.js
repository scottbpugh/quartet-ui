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

class PoolListItem extends Component {
    // renderContextMenu = () => {
    //     console.info('Rendering menu...')
    //     // return a single element, or nothing to use default browser behavior
    //     return (
    //         <Menu>
    //             <MenuItem text="Save" />
    //             <MenuItem text="Delete" />
    //         </Menu>
    //     );
    // }
    getAllowedRegionTypes = () => {
        const pool = this.props.pool;
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
        const pool = this.props.pool;
        return pool.randomizedregion_set !== undefined;
    };
    poolHasListBased = () => {
        const pool = this.props.pool;
        return pool.listbasedregion_set !== undefined;
    };
    goTo = path => {
        this.props.history.push(path);
    };
    goToEdit = (evt,pool) => {
        ContextMenu.hide();
        this.props.history.push({
            pathname: `/number-range/edit-pool/${this.props.server.serverID}/${
                pool.machine_name
            }`,
            state: {defaultValues: this.props.pool, editPool: true}
        });
    };

    renderContextMenu() {
        const serverID = this.props.server.serverID;
        const pool = this.props.pool;
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

    render() {
        const serverID = this.props.server.serverID;
        const pool = this.props.pool;
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
                        to={`/number-range/region-detail/${serverID}/${
                            pool.machine_name
                        }`}>
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
                        to={`/number-range/region-detail/${serverID}/${
                            pool.machine_name
                        }/`}>
                        {this.props.regionNumber}{" "}
                        <FormattedMessage
                            id="plugins.numberRange.regions"
                            defaultMessage="regions"
                        />
                    </Link>
                </td>
            </tr>
        );
    }
}

ContextMenuTarget(PoolListItem);

export default PoolListItem;
