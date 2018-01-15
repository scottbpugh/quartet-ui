import React, {Component} from "react";
import "./App.css";
import {
  Button,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Card,
  Tag
} from "@blueprintjs/core";

import "@blueprintjs/core/dist/blueprint.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <Navbar className=".pt-dark">
            <NavbarGroup>
              <NavbarHeading>QU4RTET</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align="right">
              <Button className="pt-minimal" iconName="home">
                Dashboard
              </Button>
              <Button className="pt-minimal" iconName="document">
                Files
              </Button>
              <NavbarDivider />
              <Button className="pt-minimal" iconName="user" />
              <Button className="pt-minimal" iconName="notifications" />
              <Button className="pt-minimal" iconName="cog" />
            </NavbarGroup>
          </Navbar>
        </header>
        <div className="wrapper">
          <div className="main-container">
            <div className="left-panel" />
            <div className="right-panel">
              <Card interactive={true} elevation={Card.ELEVATION_TWO}>
                <h5>GTIN With Us!</h5>
                <p>QU4RTET will rule the world so get a headstart now!</p>
                <div className="tags">
                  <Tag className="tag">Awesome</Tag>
                  <Tag className="tag">Performant</Tag>
                  <Tag className="tag">Open Source</Tag>
                  <Tag className="tag">GS1 Compliant</Tag>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
