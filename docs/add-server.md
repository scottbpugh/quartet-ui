# Connecting to a QU4RTET Server

## Adding a Server to the Configuration

To add a new server to your configuration, you can click on the + button in the left sidebar and "Add a New Server" menu item.

![screenshot](https://gitlab.com/lduros/quartet-ui/raw/master/docs/screenshots/add-server/1.png)

You can also click on Add a New Server on the dashboard (main) screen.

A server form will open:
![screenshot](https://gitlab.com/lduros/quartet-ui/raw/master/docs/screenshots/add-server/4.png)

The Server Setting Name is the alias name that will be used throughout the QU4RTET app. It can be anything and is personal to the QU4RTET app configuration in your computer.

The server hostname, port number, root path, SSL/TLS, and username and password must be filled to connect to the QU4RTET instance:

* Hostname: A domain name or IP address.
* Port Number: The port number to connect to the QU4RTET API (for example, 8000)
* The root path is the path prefix to get to the API. It is empty by default with the QU4RTET install.
* SSL/TLS: If you use an encryption layer (and we hope you do), turn on the switch. The dev/demo environment does not have SSL/TLS enabled by default.
* Username and Password: Your QU4RTET username and password that is granted sufficient permissions and access to interact with the QU4RTET server.

Once filled, click on save. The password is saved automatically to prevent prompting you on every request made by the application on subsequent actions/navigation.
The password is stored in the operation system password vault or keychain access. It is not persisted in the QU4RTET application. When removing a server from your QU4RTET configuration, the password is automatically removed from the OS password vault/keychain.
