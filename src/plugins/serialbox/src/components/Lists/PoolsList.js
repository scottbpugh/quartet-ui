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
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {RightPanel} from "components/layouts/Panels";
import {PaginatedList} from "components/elements/PaginatedList";
import {DeleteObject} from "components/elements/DeleteObject";
import PoolListItem from "../PoolListItem";
import PoolForm from "../PoolForm";
import {loadPoolList} from "../../reducers/numberrange";
import {PoolList} from "../PoolList";

const PoolTableHeader = props => (
    <thead style={{textAlign: "center", verticalAlign: "middle"}}>
    <tr>
        <th>
            <FormattedMessage
                id="plugins.numberrange.createdOn"
                defaultMessage="Created On"
            />
        </th>
        <th>
            <FormattedMessage
                id="plugins.numberRange.readable_name"
                defaultMessage="Readable Name"
            />
        </th>
        <th>
            <FormattedMessage id="plugins.numberRange.machine_name" defaultMessage="API Key"/>
        </th>
        <th>
            <FormattedMessage
                id="plugins.numberRange.status"
                defaultMessage="Status"
            />
        </th>
        <th>
            <FormattedMessage
                id="plugins.numberRanges.request_threshold"
                defaultMessage="Request Threshold"
            />
        </th>
        <th>
            <FormattedMessage
                id="plugins.numberRanges.regions"
                defaultMessage="View Regions"
            />
        </th>
        <th/>
    </tr>
    </thead>
);

const PoolEntry = props => {
    const goTo = path => {
        props.history.push(path);
    };

    const goToPayload = goTo.bind(
        this,
        `/number-range/edit-pool/${props.server.serverID}/${props.entry.machine_name}`
    );

    return (<PoolListItem pool={pool} {...this.props} />);
};

class _PoolsList extends Component {

    render() {
        const {server, pools, loadPoolList, count, next} = this.props;

        return (
            <RightPanel
                title={
                    <FormattedMessage
                        id="plugins.epcis.entryList"
                        defaultMessage="Entries"
                    />
                }>
                <div className="large-cards-container full-large">
                    <PaginatedList
                        {...this.props}
                        listTitle={<FormattedMessage id="plugins.numberRange.numberRangePools"/>}
                        history={this.props.history}
                        loadEntries={loadPoolList}
                        server={server}
                        entries={pools}
                        entryClass={PoolListItem}
                        tableHeaderClass={PoolTableHeader}
                        count={count}
                        next={next}
                        interactive={false}
                    />

                    {/* keep prop name generic for entries */}
                </div>
            </RightPanel>
        );
    }
}

export const PoolsList = connect(
    (state, ownProps) => {
        const isServerSet = () => {
            return (
                state.numberrange.servers &&
                state.numberrange.servers[ownProps.match.params.serverID]
            );
        };
        return {
            server: state.serversettings.servers[ownProps.match.params.serverID],
            pools: isServerSet()
                ? state.numberrange.servers[ownProps.match.params.serverID].pools
                : [],
            count: isServerSet()
                ? state.numberrange.servers[ownProps.match.params.serverID].count
                : 0,
            next: isServerSet()
                ? state.numberrange.servers[ownProps.match.params.serverID].next
                : null
        };
    },
    {loadPoolList}
)(withRouter(_PoolsList));
