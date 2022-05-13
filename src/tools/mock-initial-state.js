export default {
  dashboard: {},
  serversettings: {
    servers: {
      "d0246781-67c6-474b-8ab0-29de61b6e6bb": {
        serverID: "d0246781-67c6-474b-8ab0-29de61b6e6bb",
        protocol: "http",
        port: "8000",
        path: "",
        ssl: false,
        hostname: "localhost",
        serverSettingName: "box 1",
        url: "http://localhost:8000/",
        appList: ["", "capture", "epcis", "manifest", "rest-auth", "serialbox"],
        username: "lduros",
        password: "password1234"
      }
    }
  },
  form: {
    addRegion: {
      values: {
        active: false
      }
    }
  },
  intl: {
    defaultLocale: "en-US",
    locale: "en-US",
    messages: {
      "app.nav.servers": "Servers",
      "app.nav.numberRange": "Number Ranges",
      "app.nav.dashboard": "Dashboard",
      "app.nav.server": "Server",
      "app.nav.plugins": "Plugins",
      "app.serverSettings.serverSettings": "Server Settings",
      "app.serverSettings.addAServer": "Add a New Server",
      "app.serverSettings.serverSettingsSaved":
        "Your server settings were saved",
      "app.serverSettings.serverDeleted": "Server removed successfully",
      "app.themes.lightTheme": "Light Theme",
      "app.themes.darkTheme": "Dark Theme",
      "app.themes.contrastedTheme": "Contrasted Theme",
      "app.themes.darkBrownTheme": "Dark Brown Theme",
      "app.themes.polarTheme": "Polar Theme",
      "app.servers.addServer": "Add Server",
      "app.servers.updateServer": "Update Server",
      "app.servers.registerUser": "Register User",
      "app.servers.verifyUser": "Verify User",
      "app.servers.userCreated": "User {username} successfully created.",
      "app.servers.userVerified": "User successfully verified.",
      "app.servers.deleteServer": "Remove Server",
      "app.servers.deleteServerConfirm":
        "Are you sure you want to remove this server? No data from this server will be deleted.",
      "app.servers.noServerMsg":
        "You currently have no QU4RTET server in your configuration. Click the + icon above and add a new server.",
      "app.servers.errorFormFetch":
        "An error occurred while attempting to get this form from remote server {serverName}. {error}",
      "app.servers.errorServerFetch":
        "An error occurred while requesting initial data from server {serverName}. Please check your settings and credentials. {error}",
      "app.plugins.addPlugin": "Add a Plugin",
      "app.plugins.pluginEnabled": "Plugin enabled",
      "app.plugins.pluginDisabled": "Plugin disabled",
      "plugins.numberRange.pool": "Pool",
      "plugins.numberRange.region": "Region",
      "plugins.numberRange.allocation": "Allocation",
      "plugins.numberRange.allocateButton": "Allocate from Pool",
      "plugins.numberRange.createdOn": "Created On",
      "plugins.numberRange.readableName": "Readable Name",
      "plugins.numberRange.machineName": "Machine Name",
      "plugins.numberRange.status": "Status",
      "plugins.numberRange.requestThreshold": "Request Threshold",
      "plugins.numberRange.regions": "Regions",
      "plugins.numberRange.numberRangePools": "Number Range Pools",
      "plugins.numberRange.active": "active",
      "plugins.numberRange.inactive": "inactive",
      "plugins.numberRange.range": "Range",
      "plugins.numberRange.to": "to",
      "plugins.numberRange.state": "State",
      "plugins.numberRange.addSequentialRegion": "Add a New Sequential Region",
      "plugins.numberRange.editSequentialRegion": "Edit Sequential Region",
      "plugins.numberRange.addRandomizedRegion": "Add a New Randomized Region",
      "plugins.numberRange.editRandomizedRegion": "Edit Randomized Region",
      "plugins.numberRange.addListBasedRegion": "Add a New List Based Region",
      "plugins.numberRange.editListBasedRegion": "Edit List Based Region",
      "plugins.numberRange.addPool": "Add a New Pool",
      "plugins.numberRange.editPool": "Edit Pool",
      "plugins.numberRange.noRegionInPool":
        "There is currently no region in this pool.",
      "plugins.numberRange.regionDetailTitle": "Pool {poolName} Regions",
      "plugins.numberRange.navItemsTitle": "Serial Number Pools",
      "plugins.numberRange.current": "current",
      "plugins.numberRange.serial": "Sequential",
      "plugins.numberRange.randomized": "Randomized",
      "plugins.numberRange.deleteRegion": "Delete region {regionName}",
      "plugins.numberRange.allocatedSuccess":
        "{size} allocated to region {regionName}. You will be prompted to save the export file shortly.",
      "plugins.numberRange.regionDeletedSuccessfully":
        "Region deleted successfully",
      "plugins.numberRange.deleteRegionConfirm":
        "Are you sure you want to delete this region?",
      "plugins.numberRange.errorFetchPools":
        "An error occurred while attempting to fetch pools from {serverName}",
      "plugins.numberRange.errorVanilla":
        "An error occurred while performing this operation. {error}",
      "plugins.numberRange.errorFetchPool":
        "An error occurred while attempting to fetch {poolName}. {error}",
      "plugins.numberRange.errorFetchRegion":
        "An error occurred while attempting to get region information. {error}",
      "plugins.numberRange.errorAllocating":
        "An error occurred while attempting to allocate from pool {poolName}. {error}",
      "plugins.numberRange.errorFormFetch":
        "An error occurred while attempting to get this form from remote server {serverName}. {error}",
      "plugins.numberRange.errorFailedToGenerateFile":
        "An error occurred when attempting to generate an export file from allocation."
    }
  },
  layout: {
    pageTitle: {
      id: "nav.app.serverDetails",
      defaultMessage: "Server Details",
      values: {}
    },
    currentPath: "/server-details/d0246781-67c6-474b-8ab0-29de61b6e6bb",
    theme: "dark-brown",
    location: {
      pathname: "/server-details/d0246781-67c6-474b-8ab0-29de61b6e6bb",
      search: "",
      hash: "",
      key: "x0qo0w"
    }
  },
  plugins: {
    navTreeItems: {
      plugin_NumberRange_NumberRangeNavRoot: {
        pluginName: "NumberRange",
        pluginComponentName: "plugin_NumberRange_NumberRangeNavRoot"
      }
    },
    plugins: {
      NumberRange: {
        enabled: true
      }
    }
  },
  numberrange: {
    servers: {
      "704e4478-f018-4fb0-b0b3-2711bbdd325c": {
        pools: [
          {
            sequentialregion_set: [
              "http://localhost:8000/serialbox/sequential-region-detail/blob/"
            ],
            randomizedregion_set: [],
            created_date: "2018-03-14T15:44:06.717881Z",
            modified_date: "2018-03-14T15:44:06.717912Z",
            readable_name: "test",
            machine_name: "test",
            active: true,
            request_threshold: 50000
          }
        ],
        server: {
          serverID: "704e4478-f018-4fb0-b0b3-2711bbdd325c",
          protocol: "http",
          port: "8000",
          path: "",
          ssl: false,
          hostname: "localhost",
          serverSettingName: "box 1",
          url: "http://localhost:8000/",
          appList: [
            "",
            "capture",
            "epcis",
            "manifest",
            "rest-auth",
            "serialbox"
          ],
          username: "admin",
          password: "password1234"
        }
      },
      "d6734acf-b19f-465d-aa55-741497051d17": {
        pools: [
          {
            sequentialregion_set: [
              "http://localhost:8000/serialbox/sequential-region-detail/blob/"
            ],
            randomizedregion_set: [],
            created_date: "2018-03-14T15:44:06.717881Z",
            modified_date: "2018-03-14T15:44:06.717912Z",
            readable_name: "test",
            machine_name: "test",
            active: true,
            request_threshold: 50000
          }
        ],
        server: {
          serverID: "d6734acf-b19f-465d-aa55-741497051d17",
          protocol: "http",
          port: "8000",
          path: "",
          ssl: false,
          hostname: "localhost",
          serverSettingName: "Box 1",
          url: "http://localhost:8000/",
          appList: [
            "",
            "capture",
            "epcis",
            "manifest",
            "rest-auth",
            "serialbox"
          ],
          username: "admin",
          password: "password1234"
        }
      },
      "d8f53d6a-eaaa-4129-b3b5-d14723086f48": {
        pools: [
          {
            sequentialregion_set: [],
            randomizedregion_set: [],
            created_date: "2018-03-14T15:44:06.717881Z",
            modified_date: "2018-03-14T15:44:06.717912Z",
            readable_name: "test",
            machine_name: "test",
            active: true,
            request_threshold: 50000
          }
        ],
        server: {
          serverID: "d8f53d6a-eaaa-4129-b3b5-d14723086f48",
          protocol: "http",
          port: "8000",
          path: "",
          ssl: false,
          hostname: "localhost",
          serverSettingName: "box 1",
          url: "http://localhost:8000/",
          appList: [
            "",
            "capture",
            "epcis",
            "manifest",
            "rest-auth",
            "serialbox"
          ],
          username: "admin",
          password: "password1234"
        }
      },
      "d0246781-67c6-474b-8ab0-29de61b6e6bb": {
        pools: [
          {
            sequentialregion_set: [],
            randomizedregion_set: [
              "http://localhost:8000/serialbox/randomized-regions/random2/",
              "http://localhost:8000/serialbox/randomized-regions/random24/"
            ],
            created_date: "2018-03-19T18:23:08.964545Z",
            modified_date: "2018-03-19T18:23:08.964578Z",
            readable_name: "docker pool",
            machine_name: "dockerpool",
            active: true,
            request_threshold: 50000
          }
        ],
        server: {
          serverID: "d0246781-67c6-474b-8ab0-29de61b6e6bb",
          protocol: "http",
          port: "8000",
          path: "",
          ssl: false,
          hostname: "localhost",
          serverSettingName: "box 1",
          url: "http://localhost:8000/",
          appList: [
            "",
            "capture",
            "epcis",
            "manifest",
            "rest-auth",
            "serialbox"
          ],
          username: "lduros",
          password: "password1234"
        }
      }
    },
    currentRegions: [
      {
        pool: "dockerpool",
        created_date: "2018-03-19T18:24:46.200566Z",
        modified_date: "2018-03-20T16:50:23.186915Z",
        readable_name: "random1",
        machine_name: "random2",
        active: true,
        order: 2,
        min: 1,
        max: 10,
        start: 1,
        current: 6,
        remaining: -10
      },
      {
        pool: "dockerpool",
        created_date: "2018-03-19T18:25:10.786631Z",
        modified_date: "2018-03-19T18:25:10.786661Z",
        readable_name: "random 2",
        machine_name: "random24",
        active: true,
        order: 3,
        min: 11,
        max: 200,
        start: 173,
        current: 173,
        remaining: 189
      }
    ],
    allocationDetail: {
      numbers: [7, 9, 8, 4],
      fulfilled: true,
      type: "random",
      encoding: "decimal",
      region: "random2",
      size_granted: 4
    }
  }
};
