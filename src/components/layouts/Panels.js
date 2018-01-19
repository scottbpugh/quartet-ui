import React from "react";

export default props => (
  <div className="main-container">
    <div className="left-panel">
      <h4 className="pt-dark left-panel-title">{props.title}</h4>
      {props.leftPanel}
    </div>
    <div className="right-panel">{props.rightPanel}</div>
  </div>
);
