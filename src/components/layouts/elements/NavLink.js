import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Button} from "@blueprintjs/core";

/**
 * NavLink - A header navigation link (Router-enabled)
 * @extends Component
 */
export default class NavLink extends Component {
  render() {
    return (
      <Link to={this.props.to}>
        <Button className="pt-minimal" iconName={this.props.iconName}>
          {this.props.children}
        </Button>
      </Link>
    );
  }
}
