# Meteor REST API Demo

Meteor 1.3 API data access demo

## Current Status

Currently the demo expects a service to be available at http://localhost:9080/hub/api/provider returning list of
objects with the following structure:

```
{
    id: '243j24b24b432h4bn2',
    name: 'Some Name',
    description: 'Some description',
}
```

But of course this example can be adapted to any web service and any data structure.

## Custom Packages Used

* **http** for the REST API calls
* **less** and **materialize:materialize** for the UI