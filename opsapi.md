# OpsAPI

## Word of Caution

**OpsAPI is very much a work in progress, and not functional at this time. We wanted to get it out in the open as soon as possible, because we want to reach the best possible solution by collectively thinking about the possibilities OpsAPI creates.**

## What

OpsAPI is an API convention for operations tools. Any tool that has implemented support for OpsAPI (called a guest tool) can be displayed fully integrated within the OpsAPI Host application. Right now the only Host tool implementing these API's is OlinData's OpsTheatre internal modules, but we hope that some of the popular operations tools will implement support soon. The more adoption OpsAPI has under operations GUIs, the easier it will be to get great contirbutions.

## Why

## API Endpoint namespaces

In order for any existing dashboard to be seamlessly integrated in a shell that supports OpsAPI (OpsTheatre being the first such tool) we will need it to support the following API namespaces. The API endpoints in these namespaces will be called by tools like OpsTheatre in order to display their UI.

### /users

This namespace contains calls to query for one or more users, to create a new user and to delete users.

### /permissions

This namespace contains endpoints that allow querying and modifications to permissions. The OpsAPI host shell will need to use these endpoints to interact with each tools' native permission system

### /routes

This namespace interacts with the routes a certain OpsAPI guest will support. In many cases these will be translated into menu items in the OpsAPI Host app.

### /widgets

This namespace is used by OpsAPI host tools that have for instance dashboards or homescreens. The host can ask the API for snippets of HTML that will be displayed as widgets by the OpsAPI host.

### /workspaces

This namespace is for OpsAPI host tools to display content in the workspace area.

## What about CORS (Cross Origin Resource Sharing)?

https://en.wikipedia.org/wiki/Cross-origin_resource_sharing is mitigated by proxying requests from the OpsAPI Host tool into the guest.
