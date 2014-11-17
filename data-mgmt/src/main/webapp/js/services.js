"use strict";

var dataManageServices = angular.module("dataManageServices", []);

(function() {
  function initialRequest() {
    return {
      common: {
        entityName: "",
        version: ""
      },
      body: {}
    }
  }

  function initialResponse() {
    return {};
  }

  dataManageServices.factory("findService", function () {
    var request = initialRequest();
    var response = initialResponse();

    function reset() {
      request.body.query = {};
      request.body.projection = {};
      request.body.sort = {}; // TODO: same treatment as range for sort (use gettersetter)

      if (request.body.range) {
        delete request.body.range;
      }
    }

    reset();

    return {
      request: request,
      response: response,
      reset: reset
    }
  });

  dataManageServices.factory("insertService", function () {
    var request = initialRequest();
    var response = initialResponse();

    request.body.data = [{}];
    request.body.projection = {};

    return {
      request: request,
      response: response
    }
  });

  dataManageServices.factory("saveService", function () {
    var request = initialRequest();
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
    var request = initialRequest();
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
    var request = initialRequest();
    var response = initialResponse();

    request.body.query = {};

    return {
      request: request,
      response: response
    }
  });
})();