import React from "react";
import {Route} from "react-router";
import {AdminPanel} from "./components/AdminPanel";

class T extends React.Component {
  render() {
    return <h1>Hello</h1>;
  }
}

export default (() => {
  return [<Route key="admin" path="/admin/:serverID" component={AdminPanel} />];
})();
