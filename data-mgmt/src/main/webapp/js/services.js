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

function initialResponse() {
  return {};
}

dataManageServices.factory("findService", function () {
  var request = initialRequest();
  var response = initialResponse();

  request.body.query = {};
  request.body.projection = {};

  return {
    request: request,
    response: response
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