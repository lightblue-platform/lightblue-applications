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

  function crudService(extendRequestBody) {
    return function() {
      var service = { 
        request: { 
          body: {} 
        } 
      };

      service.newRequestBody = function() {
        var body = initialRequestBody();

        extendRequestBody(body);

        return body;
      };

      service.reset = function() {
        service.request.body = service.newRequestBody()

        return service;
      };

      service.response = initialResponse();

      return service.reset();
    }
  }

  dataManageServices.factory("findService", crudService(function (body) {
    body.query = {};
    body.projection = {};
    body.sort = {};
    body.range = [];
  }));

  dataManageServices.factory("insertService", crudService(function (body) {
    body.data = [{}];
    body.projection = {};
  }));

  dataManageServices.factory("saveService", crudService(function (body) {
    body.data = [{}];
    body.upsert = false;
    body.projection = {};
  }));

  dataManageServices.factory("updateService", crudService(function (body) {
    body.query = {};
    body.update = {};
    body.projection = {};
  }));

  dataManageServices.factory("deleteService", crudService(function (body) {
    body.query = {};
  }));
})();