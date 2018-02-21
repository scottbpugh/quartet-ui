[![build status](https://gitlab.com/serial-lab/quartet-ui/badges/master/build.svg)](https://gitlab.com/serial-lab/quartet-ui/commits/master)

# QUARTET-UI Project

This project uses React, Redux, Electron, and Blueprint for UI.

Run `yarn install` and `yarn start` to get started and spawn the Electron app (with React bootstrapped inside Electron.)
This will spawn an Electron window, as well as the React app in Google Chrome browser on port 5000 by default.

To run tests, `yarn test` from the root directory should trigger all test suites. Currently, most of the tests perform
comprehensive tests of multiple components by matching them against serialized snapshots. More tests to come.

## Screenshot

![Screenshot](public/electron-app-screenshot.png)

## Cohesive Component Structure for Reusability

There are three types of structural React components in QUARTET-UI:

* Layout components
* Screen components
* Card components

In the directory structure of this project, they are organized as follows:

```
src/components/
       └───layouts
       └───screens
       └───cards
```

These are meant to keep the layout and visual identity consistent across views and plugins.

### Layout components

Layout components are meant to define an arrangement to one or more screen components and provide a consistent
style to the broadest elements of the app. They are located in src/components/layouts.
There is currently only one layout component, called Panels, of which only RightPanel should be used by plugins.
Components can also be injected in the navigation tree in the left panel when registering plugins, as you will see in the next sections.
<Panels/> divides the main container (not including the header) into a left panel and a right panel.
The left panel is meant to provide a menu for the specific screen currently mounted.
The right panel is where the components for the main functionality for the screen are displayed.

#### Panels Layout

A RightPanel component can be used as followed, by passing a title (in the form of a FormattedMessage from react-intl) and children elements:

    import {RightPanel} from "components/layouts/panels";
    import {FormattedMessage} from "react-intl";

    const screenMenu = props => <MyMenu>;
    const contents = props => <div>content goes here...</div>;

    export default props => {
        return (<RightPanel
            title={<FormattedMessage id="plugins.MyPlugin.MyTitle"/>}><h5>My Screen</h5></RightPanel>);
    };

### Screen components

Screen components of a plugin are components mounted based on a route (e.g.: /my-plugin)
They should use a common layout component to arrange their content (e.g.: RightPanel.)
When creating a plugin, create a routes.js file in the src directory of your plugin, and return an array of Routes, e.g.:
export default (() => {
return [
<Route
key="poolList"
path="/number-range/pools/:serverID"
component={PoolList}
/>,
<Route
key="regionDetail"
path="/number-range/region-detail/:serverID/:pool"
component={RegionDetail}
/>];

### Card components

Card components are smaller pieces meant to provide a single distinct functionality to one or more screens.
They can be reused across the application where necessary.
Check src/components/cards/dashboard/NotificationsDisplay.js for a meaningful example of a card components providing notifications to the user.
It's used as part of the right panel in the Dashboard screen, located in src/components/screens/Dashboard.js

## Data Flow and State Management

QUARTET-UI uses Redux and React-Redux as its state container. This means most components do not need to manage their own state and re-rendering
of the components is based on updates from the store.
QUARTET-UI has a single store, located in src/store.js, as well as src/actions and src/reducers directories where Redux actions and reducers are located.
Plugins can inject their own reducers into the store, through the pluginRegistry singleton.

## Creating a pluginName

### What you can do with your plugin using pluginRegistry

The pluginRegistry singleton, located in src/plugins/pluginRegistration.js, allows you to add a reducer, localization messages, injected components and routes to the core application.

For a plugin to be used, QU4RTET expects an init.js file located at the root of your src/ plugin directory. The init.js file should export two functions:

* enablePlugin
* disablePlugin

As their name indicate, enablePlugin is called when a plugin is enabled from the PluginList component as well as during the initialization phase of the QU4RTET application. disablePlugin is called only when the user decides to disable the application from the PluginList screen.

In the enablePlugin function, register your reducer, set your messages, and register your navigation tree nodes that you want to see appear under the Server nodes of the nav tree in the left panel.

Here is an example of the enablePlugin function definition for the serial number range plugin:

    const PLUGIN_NAME = "NumberRange";

    export const enablePlugin = () => {
      pluginRegistry.registerReducer(
      PLUGIN_NAME,
      "numberrange",
      reducer,
      initialData()
      );
      pluginRegistry.setMessages(messages);
      pluginRegistry.registerRoutes(PLUGIN_NAME, routes);
      pluginRegistry.registerComponent(
      PLUGIN_NAME,
      NavPluginRoot,
      actions.addToTreeServers);
    };

All of the elements registered will be injected dynamically at runtime.
To register a component, you can use an action from the plugin reducer, such as addToTreeServers. This action will be dispatched from the core application to add your component. You should not dispatch actions directly from the init.js file, only pass them to be used at the discretion of the core application.

Disabling the plugin removes the elements added to the core. Currently, removing the localization messages and the reducer is not required. However, unregistering routes and injected component is required in order to remove the graphical elements that your plugin has added to the application.
