import React from "react";
import {Route} from "react-router";
import {AdminPanel} from "./components/AdminPanel";

export default (() => {
  return [<Route key="admin" path="/admin/:serverID" component={AdminPanel} />];
})();
