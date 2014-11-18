"use strict";

var dataManageServices = angular.module("dataManageServices", []);

(function() {
  function initialRequestBody() {
    return {
      objectType: "",
      version: ""
    }
  }

  function initialResponse() {
    return {};
  }

  dataManageServices.factory("findService", function () {
    var service = {};

    service.newRequestBody = function() {
      var body = initialRequestBody();

      body.query = {};
      body.projection = {};
      body.sort = {};
      body.range = [];

      return body;
    };

    service.reset = function() { 
      // Wrap in object so the body can be overwritten with a new object
      // reference and we will still maintain our top level reference (request).
      service.request = {
        body: service.newRequestBody()
      };

      return service;
    };

    service.response = initialResponse();

    return service.reset();
  });

  dataManageServices.factory("insertService", function () {
    var request = initialRequestBody();
    var response = initialResponse();

    request.body.data = [{}];
    request.body.projection = {};

    return {
      request: request,
      response: response
    }
  });

  dataManageServices.factory("saveService", function () {
    var request = initialRequestBody();
    var response = initialResponse();

    request.body.data = [{}];
    request.body.upsert = false;
    request.body.projection = {};

    return {
      request: request,
      response: response
    }
  });

  dataManageServices.factory("updateService", function () {
    var request = initialRequestBody();
    var response = initialResponse();

    request.body.query = {};
    request.body.update = {};
    request.body.projection = {};

    return {
      request: request,
      response: response
    }
  });

  dataManageServices.factory("deleteService", function () {
    var request = initialRequestBody();
    var response = initialResponse();

    request.body.query = {};

    return {
      request: request,
      response: response
    }
  });
})();