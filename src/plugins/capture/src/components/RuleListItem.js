// Core
import React, { useState } from 'react';
import { connect } from "react-redux";
import classNames from "classnames";
import { FormattedMessage, FormattedDate, FormattedNumber } from "react-intl";
import { Link } from "react-router-dom";
const { showMessage } = qu4rtet.require("./lib/message");
const {RightPanel} = qu4rtet.require("./components/layouts/Panels");

// Blueprint js
import {
    Card,
    Popover,
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
} from "@blueprintjs/core";

// Plugins
import {pluginRegistry} from "../../../pluginRegistration";
// Reducers
import {loadRules, deleteRule} from "../reducers/capture";
// Specific to component
import {DeleteDialog} from "components/elements/DeleteDialog";

const intl = pluginRegistry.getIntl()


export const RuleListItem = (props) => {
    
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    
    const {
        server,
        history,
        entry,
        page
    } = props;

    const serverID = server.serverID;
    const rule = entry;

    const goTo = (path) => {
        history.push(path);
    };

    const goToEdit = (evt, rule) => {
        ContextMenu.hide();
        history.push({
            pathname: `/capture/edit-rule/${this.props.server.serverID}/rule/${rule.id}/step/`,
            state: {defaultValues: entry, editPool: true}
        });
    };

    const renderContextMenu = (e) => {
        
        const intl = pluginRegistry.getIntl();
        console.info('Rendering menu for rule ' + rule.name);
        ContextMenu.show (
            <Menu>
                <ButtonGroup className="context-menu-control" minimal={true}>
                    <Button small={true} onClick={() => goToEdit(rule)} icon="edit"/>
                    <Button
                        small={true}
                        onClick={toggleConfirmDelete}
                        icon="trash"
                    />
                </ButtonGroup>
                <MenuDivider title={rule.name}/>
                <MenuDivider/>
                <MenuItem
                    icon="copy"
                    onClick={onCopy}
                    text={intl.formatMessage({
                        id: "plugins.capture.copy"
                    })}
                />
            </Menu>, { left: e.clientX, top: e.clientY }
        );
    }

    const onCopy = (e) =>{
        return;
    };

    const toggleConfirmDelete = (e) => {
        setConfirmDeleteOpen(!isConfirmDeleteOpen);
    };
    
    const deleteRule = (e) => {
        const serverObject = pluginRegistry.getServer(serverID);
        toggleConfirmDelete();
        ContextMenu.hide();
        deleteRule(serverObject, this.props.entry);
        history.push(`/number-range/pools/${serverID}`);
    };
    
    
    return (
        
            <tr key={rule.name} onContextMenu={renderContextMenu}>
                <td>
                    <FormattedDate
                        value={rule.created_date}
                        day="numeric"
                        month="long"
                        year="numeric"
                    />
                </td>
                <td>{rule.name}</td>
                <td>
                    <Link
                        to={`/capture/edit-rule/${serverID}/rule/${rule.id}/step/?returnpage=${page}`}>
                        {rule.name}
                    </Link>
                </td>
                
                <DeleteDialog
                    isOpen={isConfirmDeleteOpen}
                    title={
                        <FormattedMessage
                            id="plugins.numberRange.deletePool"
                            values={{poolName: rule.name}}
                        />
                    }
                    body={
                        <FormattedMessage id="plugins.numberRange.deletePoolConfirm"/>
                    }
                    toggle={toggleConfirmDelete}
                    deleteAction={deleteRule}
                />
            </tr>
    )
}

ContextMenuTarget(RuleListItem);

const mapStateToProps = state => ({
    theme: state.layout.theme
});

export default connect(
    mapStateToProps,
    {setAllocation, deleteAPool}
)(RuleListItem);