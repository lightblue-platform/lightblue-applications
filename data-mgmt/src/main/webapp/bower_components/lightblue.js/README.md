# lightblue.js

A [lightblue](https://github.com/lightblue-platform) client written in Javascript.

Conceivably one day useful for:
- Node.JS apps talking to a Lightblue REST service
- Client side apps communicating with a server that forwards requests to a Lightblue REST service

At the moment this is really just a rough sketch of an idea and will change drastically.

# Install

`bower install lightblue.js --save`

`npm install lightblue.js --save`

`git clone https://github.com/alechenninger/lightblue.js.git`

# Usage

It does still sort of work! It won't actually make any requests, but gives you an API for building the key components of the request: the HTTP method, the URL, and the request body. The idea is this information could then be used easily with either XMLHttpRequest, jQuery.ajax, Angular's $http service, or a Node.JS HTTP client. All it takes is a little glue code to tie the necessary components with one of the aforementioned common AJAX mechanisms.

Use browserify `require` or commonjs `define`, or just include dist/lightblue.min.js and use the namespace `lightblue`.

## Imports: 

```javascript
// Plain old HTML
<script src="lightblue.min.js"></script>

// NodeJS or Browserify
var lightblue = require("./lightblue.min.js");

// CommonJS and RequireJS work too but I don't have an example
```

## Construct a find request:

```javascript
// Assumes /data and /metadata for data and metadata services respectively, 
// but you can override.
var client = lightblue.getClient("http://my.lightblue.host.com/rest"); 
var field = lightblue.field;

var find = client.data.find({
  entity: "User",
  version: "1.0.0",
  // Query builder, or just pass a query string
  query: field("username").equalTo("bob")
    .or(field("firstName").equalTo(field("username"))
      .and(field("age").greaterThan(4))).toJSON(),
  // No projection builder yet but it would be something like this:
  projection: include("*").recursively().toJSON()
});

assertEquals("http://my.lightblue.host.com/rest/data/find/User/1.0.0", find.url);
assertEquals("post", find.method);
assertEquals({
   objectType: "User",
   version: "1.0.0",
   query: {
     $or: [
       {
         field: "username",
         op: "$eq",
         rvalue: "bob"
       },
       {
         $and: [
           {
             field: "firstName",
             op: "$eq",
             rfield: "username"
           },
           {
             field: "age",
             op: "$gt",
             rvalue: 4
           }
         ]
       }
    ]
  },
  projection: {
    field: "*",
    recursive: true
  }
 }, find.body);
```
