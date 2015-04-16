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

  dataManageServices.factory("insertService", crudService(function(body) {
    body.data = [{}];
    body.projection = {};
  }));

  dataManageServices.factory("saveService", crudService(function(body) {
    body.data = [{}];
    body.upsert = false;
    body.projection = {};
  }));

  dataManageServices.factory("updateService", crudService(function(body) {
    body.query = {};
    body.update = {};
    body.projection = {};
  }));

  dataManageServices.factory("deleteService", crudService(function(body) {
    body.query = {};
  }));

  dataManageServices.factory("environmentService", ["localStorage",
    function(localStorage) {
      var envsStorageKey = "environments";

      function getEnvironments() {
        var envs = localStorage.getItem(envsStorageKey);

        if (envs === null) {
          return [];
        }

        return JSON.parse(envs);
      }

      function addEnvironment(env) {
        var envs = getEnvironments();
        envs.push(env);
        updateEnvironments(envs);
      }

      function removeEnvironment(env) {
        var envs = getEnvironments()
            .filter(function(e) { return e.alias !== env.alias; });
        updateEnvironments(envs);
      }

      function updateEnvironment(env) {
        var envs = getEnvironments()
            .filter(function(e) { return e.alias !== env.alias; });
        envs.push(env);
        updateEnvironments(env);
      }

      // Not publically exposed
      function updateEnvironments(envs) {
        localStorage.setItem(envsStorageKey, JSON.stringify(envs));
      }

      return {
        getEnvironments: getEnvironments,
        addEnvironment: addEnvironment,
        removeEnvironment: removeEnvironment,
        updateEnvironment: updateEnvironment
      }
  }])

  function UtilityService() {}
  UtilityService.prototype.arrayContains = function(array, contains) {
    return array.indexOf(contains) >= 0;
  };

  dataManageServices.service("util", UtilityService);

  dataManageServices.factory("localStorage", function() {
    return window.localStorage;
  })

  dataManageServices.factory("sessionStorage", function() {
    return window.sessionStorage;
  })
})();