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

const defaultLocaleMsg = {
  users: {
    navItemsTitle: "User Management",
    noUserPluginFound: "No User Management module detected on server",
    users: "Users",
    groups: "Groups",
    permissions: "Permissions",
    addUser: "Add a User",
    addGroup: "Add a Group",
    editGroup: "Edit Group",
    addPermission: "Add a Permission",
    id: "User ID",
    username: "Username",
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    is_staff: "Staff",
    is_active: "Active",
    is_superuser: "SuperUser",
    deleteUserConfirm: "Are you sure you want to delete this user?",
    deleteUserConfirmBody:
      "This will remove the user permanently from the server.",
    usersList: "Users",
    editUser: "Edit User",
    userStatus: "User Status",
    permissionsList: "Permissions",
    groupsList: "Groups",
    saveSelection: "Save Selection",
    clearSelection: "Clear Selection",
    deleteGroupConfirm: "Are you sure you want to delete this group?",
    deleteGroupConfirmBody:
      "This will remove the group permanently from the server.",
    name: "Name",
    errorLoadingUsers:
      "An error occurred while attempting to load users: {error}",
    errorLoadingGroups:
      "An error occurred while attempting to load groups: {error}"
  }
};

const french = {
  navItemsTitle: "Gestion des utilisateurs",
  noUserPluginFound: "Module de gestion d'utilisateurs non installé",
  users: "Utilisateurs",
  groups: "Groupes",
  permissions: "Permissions",
  addUser: "Ajouter un utilisateur",
  addGroup: "Ajouter un groupe",
  addPermission: "Ajouter une permission",
  id: "ID d'utilisateur",
  username: "Nom d'utilisateur",
  first_name: "Prénom",
  last_name: "Nom de famille",
  email: "Email",
  is_staff: "Personnel",
  is_active: "Actif",
  is_superuser: "Super Utilisateur",
  deleteUserConfirm: "Etes-vous certain de vouloir supprimer cet utilisateur?",
  deleteUserConfirmBody:
    "Cet utilisateur sera supprimé du serveur de manière permanente.",
  deleteGroupConfirm: "Etes-vous certain de vouloir supprimer ce groupe?",
  deleteGroupConfirmBody:
    "Ce groupe sera supprimé du serveur de manière permanente.",
  usersList: "Utilisateurs",
  editUser: "Modifier utilisateur",
  userStatus: "Statut d'utilisateur",
  saveSelection: "Enregistrer la sélection",
  clearSelection: "Effacer la sélection",
  editGroup: "Modifier groupe",
  name: "Nom",
  errorLoadingUsers:
    "An error occurred while attempting to load users: {error}",
  errorLoadingGroups:
    "An error occurred while attempting to load groups: {error}"
};

export default {
  "en-US": {plugins: {...defaultLocaleMsg}},
  "fr-FR": {
    plugins: {
      users: {
        ...defaultLocaleMsg.users,
        ...french
      }
    }
  }
};
