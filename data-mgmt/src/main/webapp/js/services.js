"use strict";

var dataManageServices = angular.module("dataManageServices", []);

dataManageServices.provider("lightblue", function LightblueProvider() {
  var _host = "";

  this.setLightblueHost = function(host) {
    _host = host;
  }

  this.getLightblueHost = function() {
    return _host;
  }

  this.$get = ["$http", function lightblueFactory($http) {
    return new NgLightblue($http, _host);
  }];
});

function initialRequest() {
  return {
    common: {
      entity: "",
      version: ""
    },
    body: {}
  }
}

dataManageServices.factory("findService", function () {
  var request = initialRequest();

  request.body.query = {};
  request.body.projection = {};

  return {
    request: request
  }
});

dataManageServices.factory("insertService", function () {
  var request = initialRequest();

  request.body.data = [{}];
  request.body.projection = {};

  return {
    request: request
  }
});

dataManageServices.factory("saveService", function () {
  var request = initialRequest();

  request.body.data = [{}];
  request.body.upsert = false;
  request.body.projection = {};

  return {
    request: request
  }
});

dataManageServices.factory("updateService", function () {
  var request = initialRequest();

  request.body.query = {};
  request.body.update = {};
  request.body.projection = {};

  return {
    request: request
  }
});

dataManageServices.factory("deleteService", function () {
  var request = initialRequest();

  request.body.query = {};

  return {
    request: request
  }
});