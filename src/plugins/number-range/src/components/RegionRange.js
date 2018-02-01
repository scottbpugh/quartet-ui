import React, {Component} from "react";

export default class RegionRange extends Component {
  render() {
    let start = Number(this.props.start);
    let end = Number(this.props.end);
    let state = Number(this.props.state);
    let range = end - start + 1;
    let correctedStart = state - start;
    let percent = Math.ceil(correctedStart * 100 / (end - start) * 3);
    return (
      <div className="visual">
        <svg
          className="chart"
          width="320"
          height="40px"
          aria-labelledby="title desc"
          role="img">
          <g className="barchart">
            <g className="bar">
              <rect className="unused" width="300" height="40" />
            </g>
            <g className="bar">
              <rect className="used" width={percent} height="40" />
            </g>
            <text x="50%" y="25" textAnchor="middle">
              {correctedStart}/{range}
            </text>
          </g>
        </svg>
      </div>
    );
  }
}
