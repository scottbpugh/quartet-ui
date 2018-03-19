// Copyright (c) 2018 SerialLab Corp.
//
// GNU GENERAL PUBLIC LICENSE
//    Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

export default {
  "en-US": {
    app: {
      nav: {
        servers: "Servers",
        numberRange: "Number Ranges",
        dashboard: "Dashboard",
        server: "Server",
        plugins: "Plugins"
      },
      serverSettings: {
        serverSettings: "Server Settings",
        addAServer: "Add a New Server",
        serverSettingsSaved: "Your server settings were saved",
        serverDeleted: "Server removed successfully"
      },
      themes: {
        lightTheme: "Light Theme",
        darkTheme: "Dark Theme",
        contrastedTheme: "Contrasted Theme",
        darkBrownTheme: "Dark Brown Theme",
        polarTheme: "Polar Theme"
      },
      servers: {
        addServer: "Add Server",
        updateServer: "Update Server",
        registerUser: "Register User",
        verifyUser: "Verify User",
        userCreated: "User {username} successfully created.",
        userVerified: "User successfully verified.",
        deleteServer: "Remove Server",
        deleteServerConfirm:
          "Are you sure you want to remove this server? No data from this server will be deleted.",
        noServerMsg:
          "You currently have no QU4RTET server in your configuration. Click the + icon above and add a new server.",
        errorFormFetch:
          "An error occurred while attempting to get this form from remote server {serverName}. {error}",
        errorServerFetch:
          "An error occurred while requesting initial data from server {serverName}. Please check your settings and credentials. {error}"
      },
      plugins: {
        addPlugin: "Add a Plugin",
        pluginEnabled: "Plugin enabled",
        pluginDisabled: "Plugin disabled"
      }
    },

    plugins: {}
  },
  "fr-FR": {
    app: {
      nav: {
        servers: "Serveurs",
        numberRange: "Plage de numéros",
        dashboard: "Tableau de bord",
        server: "Serveur",
        plugins: "Plugins"
      },
      serverSettings: {
        serverSettings: "Paramètres serveur",
        addAServer: "Ajouter un serveur"
      },
      themes: {
        lightTheme: "Thème clair",
        darkTheme: "Thème sombre",
        contrastedTheme: "Thème contrasté",
        darkBrownTheme: "Thème marron sombre",
        polarTheme: "Thème polaire"
      },
      servers: {
        addServer: "Ajouter le serveur",
        updateServer: "Sauvegarder",
        registerUser: "Ajouter un utilisateur",
        verifyUser: "Vérifier un utilisateur",
        userCreated: "L'utilisateur {username} a été créé avec succès.",
        userVerified: "Compte d'utilisateur confirmé.",
        deleteServer: "Retirer le server"
      },
      plugins: {
        addPlugin: "Ajouter un plugin"
      }
    },
    plugins: {}
  }
};
