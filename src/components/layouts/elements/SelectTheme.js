/*
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# Copyright 2019 SerialLab Corp.  All rights reserved.
*/


import React, {Component} from "react";
import {connect} from "react-redux";
import {switchTheme} from "reducers/layout";
import {Button, MenuItem} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";


const themes = [
    {msgId: "app.themes.lightTheme", name: "Light Theme", id: "light"},
    {msgId: "app.themes.darkTheme", name: "Dark Theme", id: "dark"},
    {
        msgId: "app.themes.contrastedTheme",
        name: "Contrasted Theme",
        id: "contrasted"
    },
    {
        msgId: "app.themes.darkBrownTheme",
        name: "Dark Brown Theme",
        id: "dark-brown"
    },
    {msgId: "app.themes.polarTheme", name: "Polar Theme", id: "polar"}
];


class SelectTheme extends Component {
    static renderListItem(theme, a) {
        return (
            <MenuItem
                text={theme.name}
                onClick={a.modifiers.active ? undefined : a.handleClick}
                id={theme.id}
                key={theme.id}
            >
            </MenuItem>
        )
    }

    handleItemChange(activeItem) {
        console.info('handleitemchange being called.');
        this.props.switchTheme(activeItem);
    }

    getThemeName(){
        return this.props.currentThemeObj !== undefined ? this.props.currentThemeObj.name :
            "Default Theme"
    }

    render() {
        let handleChange = this.handleItemChange.bind(this);
        return (
            <Select
                items={themes}
                itemRenderer={SelectTheme.renderListItem}
                filterable={false}
                activeItem={this.props.currentLocale}
                onItemSelect={handleChange}
                popoverProps={{minimal: true}}
            >
                <Button text={this.getThemeName()} rightIcon="double-caret-vertical"/>
            </Select>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentTheme: state.layout.theme,
        currentThemeObj: state.layout.themeObject
    };
}

export default connect(
    mapStateToProps,
    {switchTheme}
)(SelectTheme);
