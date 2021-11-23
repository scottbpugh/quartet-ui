# Connecting to a QU4RTET Server

## Adding a Server to the Configuration

To add a new server to your configuration, you can click on the + button in the left sidebar and "Add a New Server" menu item.

![screenshot](https://gitlab.com/lduros/quartet-ui/raw/master/docs/screenshots/add-server/1.png)

You can also click on Add a New Server on the dashboard (main) screen.

A server form will open:
![screenshot](https://gitlab.com/lduros/quartet-ui/raw/master/docs/screenshots/add-server/4.png)

The Server Setting Name is the alias name that will be used throughout the QU4RTET app. It can be anything and is personal to the QU4RTET app configuration in your computer.

The server hostname, port number, root path, SSL/TLS, and username and password must be filled to connect to the QU4RTET instance:

* Protocol: http or https
* Hostname: A domain name or IP address.
* Port Number: The port number to connect to the QU4RTET API (for example, 8000)
* The root path is the path prefix to get to the API. It is empty by default with the QU4RTET install.
* SSL/TLS: If you use an encryption layer (and we hope you do), turn on the switch. The dev/demo environment does not have SSL/TLS enabled by default.
* Username and Password: Your QU4RTET username and password that is granted sufficient permissions and access to interact with the QU4RTET server.

Once filled, click on save.

## Server Settings

After saving your server, you will see a list of your settings fields as well as a map of the services detected on the QU4RTET server. If the credentials or other settings are incorrect, a red toast notification will be displayed with more information on the error (e.g.: failed to fetch, meaning the application could not reach the server at all, or unauthorized, meaning that the credentials are either wrong or they do not have access to the API.)
![screenshot](https://gitlab.com/lduros/quartet-ui/raw/master/docs/screenshots/add-server/5.png)

As soon as the application detects services, the navigation subtree on the left for this particular server will be populated with nodes to interact with these services.
