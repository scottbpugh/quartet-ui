import React, {Component} from 'react';
import {Spinner} from "@blueprintjs/core";

class Loader extends Component {
    render() {
        return (
            <div className="auto-cards-container">
                <Spinner intent="primary" size={Spinner.SIZE_LARGE} value={null} />
            </div>
        );
    }
}

export default Loader;
