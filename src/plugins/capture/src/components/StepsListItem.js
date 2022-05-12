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
import React, {Component} from 'react';
import {deleteStep} from "../reducers/capture";

class StepsListItem extends Component {
    render() {
        const serverID = this.props.server.serverID;
        const pool = this.props.entry;
        return (
            <tr id={entry.id}>
                <td>{entry.name}</td>
                <td>{entry.order}</td>
                <td>{entry.class}</td>
                <td>{entry.description}</td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({
    theme: state.layout.theme
});

export default connect(
    mapStateToProps,
    {deleteStep}
)(StepsListItem);
