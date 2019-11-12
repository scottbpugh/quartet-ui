import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {Card, HTMLTable} from "@blueprintjs/core";
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";

const StepsListTableHeader = (props) => (
    <thead style={{textAlign: "center", verticalAlign: "middle"}}>
    <tr>
        <th>
            <FormattedMessage
                id="plugins.capture.name"
                defaultMessage="Name"
            />
        </th>
        <th>
            <FormattedMessage
                id="plugins.capture.order"
                defaultMessage="Order"
            />
        </th>
        <th>
            <FormattedMessage id="plugins.capture.class" defaultMessage="Class"/>
        </th>
        <th>
            <FormattedMessage
                id="plugins.capture.description"
                defaultMessage="Description"
            />
        </th>
    </tr>
    </thead>
);

class StepsList extends Component {
    editStep(stepID){
        this.props.history.push(`/capture/edit-step/${this.props.server.serverID}/rule/${this.props.rule.id}/step/${stepID}`)
    }

    steprow = (step) => {
        return (
            <tr id={step.id}>
                <td onClick={() => this.editStep(step.id)}>{step.name}</td>
                <td onClick={() => this.editStep(step.id)}>{step.order}</td>
                <td onClick={() => this.editStep(step.id)}>{step.step_class}</td>
                <td onClick={() => this.editStep(step.id)}>{step.description}</td>
            </tr>
        )
    };

    render() {
        if (this.props.rule && this.props.rule.step_set) {
            return (
                <div>
                    <h5 className="bp3-heading">Steps</h5>
                    <HTMLTable className="paginated-list-table"
                               bordered={true}
                               condensed={true}
                               interactive={true}
                               striped={true}

                    >
                        <StepsListTableHeader/>
                        <tbody>
                        {this.props.rule.step_set.map((step) => {
                            return this.steprow(step)
                        })}
                        </tbody>
                    </HTMLTable>
                </div>
            );
        }
    }
}


function mapStateToProps(state, ownProps) {
    return {
        server: state.serversettings.servers[ownProps.match.params.serverID],
    };
}

export default connect(
    mapStateToProps,
)(withRouter(StepsList));
