# EPCIS Plugin

## Overview

The EPCIS plugin lists events, entries and all data related to them.

### Events List

To see the list of events that have been recorded on a given system, expand the EPCIS node under the server of your choice, then click on the `Events` node.

![screenshot](./screenshots/epcis/2.png)
Events can be searched across the entire database using the top right search box. Events are displayed twenty at a time.

You can also narrow down the events returned by clicking on the event types nodes under the Events node. There are four types of event filters available:

* Aggregation Events
* Object Events
* Transaction Events
* Transformation Events

### Event Detail

From any of the event list screens, clicking on an event row will take you to the event detail screen, where you can find fields and attributes for the event selected:

![screenshot](./screenshots/epcis/3.png)

Event data is divided into four groups:

* What: Detail on what the event is, what are the entries related to it, Instance/lot master data, and transaction data.

* When: When this event occurred

* Where: All the geo-location data related to this event (SGLN, ...)

* Why: Details on the reason why this event occurred, and errors, if applicable.

### Entries List

To get to the entries list, where all entries are displayed (twenty at a time), click on the Entries node under the EPCIS node:

![screenshot](./screenshots/epcis/5.png)

Entries can be searched by entry identifier using the top right search box:

![screenshot](./screenshots/epcis/6.png)

When clicking on an entry row, you are taken to the entry detail page:

![screenshot](./screenshots/epcis/4.png)

The timeline at the top gives an overview of the events that have been recorded and are related to this entry. You can then see the detail of each event, similarly to what you see on the event detail screen, but for all the events related to the entry.

