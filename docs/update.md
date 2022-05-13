# Auto Update Process

## Gitlab 
The QU4RTET UI will automatically check for new plugins and new plugin 
versions by checking the following locations (depending on whether
you are running the UI from a binary distribution or via a terminal/
command line using yarn/npm).

### Binary Distributions
Each running instance will check the following location for a 
runtime manifest that will include all of the plugins to be loaded,
what their versions are and whether or not they should be loaded into
an enabled state by default.  

    https://gitlab.com/serial-lab/quartet-ui-plugins/blob/master/plugins.json

### Development 
When running the UI from the command line/terminal using yarn, the 
application will default to checking the develop branch version of 
the `plugins.json` file mentioned above.  The URL is as follows:

    https://gitlab.com/serial-lab/quartet-ui-plugins/blob/develop/plugins.json

### Failover
If, for whatever reason, the UI can not establish connectivity to 
either of the above files, it will use the file located in the core
under `[APP ROOT]/public/main-process/pluginsList-fallback.json`.

** It is important to keep this relatively file up to date to ensure
that the fail-over functions properly.** You run the risk of loading
older/broken versions of plugins that may or may not include the 
full list of necessary plugins for the current user.  

In addition to connectivity errors, if there is a syntax error in 
any of the gitlab JSON files the fallback file will be utilized.

### Note on Developer Tools
If you are developing a plugin for QU4RTET UI and you wish to use the 
UI *Developer Tools* that allow for hot-loading new plugins, you must
run the UI from the development branch since the developer plugins
are only defined in the development branch.

## Plugin Distribution and Updates

It is important to understand that any new plugins or new
plugin versions **must** be maintained in the `quartet-ui-plugins`
repository.  If you initiate a pull request for a plugin and/or
add a new plugin, you must also submit a corresponding pull request
for the update to the appropriate `quartet-ui-plugins/plugins.json` 
file.  
