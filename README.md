[![build status](https://gitlab.com/serial-lab/quartet-ui/badges/master/build.svg)](https://gitlab.com/serial-lab/quartet-ui/commits/master)

# QU4RTET Desktop Application

For a guide on how to use this application, please see the [QU4RTET App End User Documentation](https://serial-lab.gitlab.io/quartet-ui/).

Run `yarn install` and `yarn start` to get started and spawn the Electron app (with React bootstrapped inside Electron.)
This will spawn an Electron window, as well as the React app in Google Chrome browser on port 5000 by default.

To run tests, `yarn test` from the root directory should trigger all test suites. Currently, most of the tests perform
comprehensive tests of multiple components by matching them against serialized snapshots. More tests to come.

## Screenshot

![screenshot](https://gitlab.com/lduros/quartet-ui/raw/master/docs/screenshots/main-screen/1.png)

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
        initialData());
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

### Injecting tree nodes into the left sidebar tree

You can pass treenodes to be displayed under the Servers nodes using the addToTreeServers action and the registerComponent method from the pluginRegistry.

    pluginRegistry.registerComponent(
      PLUGIN_NAME,
      MyPluginTreeNode,
      actions.addToTreeServers);

Your component should return a valid single <TreeNode> component, but it can contain many layers of children nodes.

      <TreeNode
        onContextMenu={this.renderContextMenu}
        nodeType="plugin"
        depth={this.props.depth}
        childrenNodes={children}
        active={this.state.active}
        path={`/number-range/pools/${serverID}`}>
        <FormattedMessage id="plugins.numberRange.navItemsTitle" />
      </TreeNode>

You can use the onContextMenu event handler to display a menu of your choice when right clicking on the item.
child nodes can also use the onContext menu.
A depth prop is provided through injection (typically starting at 1 at the plugin level.)
You must pass this.props.depth, untouched, for each TreeNode (including the array of nested TreeNodes passed through the childrenNodes prop.)
This is used to display the proper level of indentation in the tree.
The path prop is used to redirect the user to a route when using the left click.
The active prop is used to highlight the node when it meets conditions of your choice.
For instance, in the case of the Serial Number Range pool tree node, it will be highlighted when the location pathname matches the same serverID as the serial number node as well as the pool machine name:

    const {pool, serverID} = this.props;
    let regexp = new RegExp(`/${serverID}/${pool.machine_name}/?$`);
    this.setState({active: regexp.test(this.props.currentPath)});

Your TreeNode components can be connected to any redux state in the application.
The active conditional above, for instance, uses the state.layout.currentPath variable.

You can connect your custom components that return <TreeNode> with the react-redux connect helper function:

    const PoolItem = connect(
      state => {
        return {
          currentRegions: state.numberrange.currentRegions,
          servers: state.serversettings.servers,
          currentPath: state.layout.currentPath
        };
      },
      {setAllocation})(withRouter(_PoolItem));

You can also map action creators or dispatch it. In this example above, we use the setAllocation action creator.
The top component injected in the tree also gets this.props.intl passed to it. This allows you to make string translations on the fly without being a direct descendant of the IntlProvider.
This is particularly useful for the onContextMenu event handler, to provide translations for the BlueprintJS MenuItem label:

    renderContextMenu = () => {
      const {servers, serverID, intl} = this.props;
      return (
        <Menu>
          <MenuDivider title={servers[serverID].serverSettingName} />
          <MenuDivider />
          <MenuItem
            onClick={this.goTo.bind(this, `/number-range/add-pool/${serverID}`)}
            text={intl.formatMessage({
              id: "plugins.numberRange.addPool"
            })}
          />
        </Menu>
        );
    };

You must pass the intl prop explicitely for items used in props.childrenNodes to benefit from it for deeper layers of the tree.

### Getting your plugin available in the PluginList component

Currently, the list of plugins available is strictly offline and they are contained within the src/plugins/ directory of quartet-ui.
Eventually, non-core plugins will be enabled and installed through npm or another package manager and the metadata on the plugins should be available through a remote server providing a list formatted in JSON for the plugins (after review and approval.)
To add your core plugin to the list of plugins that can be installed, add an entry in the default export object of the src/plugins/plugin-repo.js file with the following key/value pairs:

NumberRange: {
core: true,
preview: "/plugin-screenshots/number-range.png",
initPath: "number-range/src/init.js",
readableName: "Serial Number Range Management",
pluginName: "NumberRange",
description: `
The Serial Number Range Management plugin offers users the
ability to interact with SerialBox, the backend solution for
your serial number range management requirements.

                Among other functions, this plugin offers the ability to create
                pools and serial number ranges as well as allocate numbers on
                the fly from the QU4RTET interface.
            `
       }
    };

The plugin will then appear in the list of plugins that you can enable and disable from the <PluginList/> component.
Clicking the Enable button will trigger enablePlugin function in init.js and plugin-specific actions from the core plugin reducer.
The state of the plugin enabled is added to the redux store and saved persistently in the localstorage.
Further restart of the app trigger the enablePlugin function from the custom init.js and adds the routes, reducer, and components registered there.
