import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {Card, HTMLTable} from "@blueprintjs/core";

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

export class StepsList extends Component {
    steprow = (step) => {
        return (
            <tr id={step.id}>
                <td>{step.name}</td>
                <td>{step.order}</td>
                <td>{step.step_class}</td>
                <td>{step.description}</td>
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

