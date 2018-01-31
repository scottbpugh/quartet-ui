import React, {Component} from "react";

export default class RegionRange extends Component {
  render() {
    let start = Number(this.props.start);
    let end = Number(this.props.end);
    let state = Number(this.props.state);
    let range = end - start;
    let correctedStart = state - start;
    let percent = Math.ceil(correctedStart * 100 / (end - start) * 4);
    return (
      <svg
        className="chart"
        width="420"
        height="150"
        aria-labelledby="title desc"
        role="img">
        <g className="barchart">
          <g className="bar">
            <rect className="unused" width="400" height="40" />
          </g>
          <g className="bar">
            <rect className="used" width={percent} height="40" />
          </g>
          <text x="50%" y="25" textAnchor="middle">
            {correctedStart}/{range}
          </text>
        </g>
      </svg>
    );
  }
}
