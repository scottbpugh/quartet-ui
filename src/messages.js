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
      dashboard: {
        dashboardHeader3: "The Open Source Level 4",
        start: "Start",
        connectServer: "Connect to a Server",
        resourcesDocumentation: "Resources & Documentation",
        documentation: "{projectName} Module Documentation",
        documentationOnly: "{projectName} Documentation",
        servers: "Servers",
        noServerFound:
          "You currently have no QU4RTET server in your configuration.",
        version: "Version {appVersion}"
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
      common: {
        mainError:
          "An error occurred while performing this action. Please check the QU4RTET server for more information. {msg}"
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
      dashboard: {
        dashboardHeader3: "Le logiciel libre de Niveau 4",
        start: "Commencer",
        connectServer: "Se connecter a un serveur",
        resourcesDocumentation: "Ressources et documentation",
        documentation: "Documentation du module {projectName}",
        documentationOnly: "Documentation de {projectName}",
        servers: "Serveurs",
        noServerFound:
          "Il n'y a aucun serveur QU4RTET dans votre configuration.",
        version: "Version {appVersion}"
      },
      serverSettings: {
        serverSettings: "Paramètres serveur",
        addAServer: "Ajouter un serveur",
        serverSettingsSaved:
          "Les paramètres de votre serveur ont été enregistrés",
        serverDeleted: "Le serveur a bien été retiré"
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
        deleteServer: "Retirer le server",
        noServerMsg:
          "Aucun serveur disponible dans cette configuration. Veuillez cliquer sur l'icone + au dessus pour ajouter un nouveau serveur.",
        deleteServerConfirm:
          "Êtes-vous sûr de vouloir retirer ce serveur? Aucune donnée de ce serveur ne sera supprimée.",
        errorFormFetch:
          "Une erreur s'est produite lors de la tentative d'obtention de ce formulaire à partir du serveur distant {serverName}. {error}",
        errorServerFetch:
          "Une erreur s'est produite lors de la demande des données initiales du serveur {serverName}. Veuillez vérifier vos paramètres et vos informations d'identification. {error}"
      },
      plugins: {
        addPlugin: "Ajouter un plugin"
      }
    },
    plugins: {}
  }
};
