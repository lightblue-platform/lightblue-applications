var lightblueServices = angular.module("lightblueServices", []);

lightblueServices.service("lightblueDataService", ["$http", NgLightblueDataClient]);
lightblueServices.service("lightblueMetadataService", ["$http", NgLightblueMetadataClient]);

function NgLightblueDataClient($http) {
  var _client;

  function _checkClient() {
    if (angular.isUndefined(_client)) {
      throw new Error("No host defined for lightblue data service.");
    }
  }

  function _execute(request) {
    return $http[request.method](request.url, request.body);
  }

  this.find = function(config) {
    _checkClient()
    return _execute(_client.find(config));
  }

  this.insert = function(data) {
    _checkClient()
    return _execute(_client.insert(config));
  }

  this.save = function(data) {
    _checkClient()
    return _execute(_client.save(config));
  }

  this.update = function(data) {
    _checkClient()
    return _execute(_client.update(config));
  }

  this.delete = function(data) {
    _checkClient()
    return _execute(_client.delete(config));
  }

  this.setHost = function(host) {
    _client = lightblue.getDataClient(host);
  }

  this.unsetHost = function() {
    _client = undefined;
  };
}

function NgLightblueMetadataClient($http) {
  var _client;

  function _checkClient() {
    if (angular.isUndefined(_client)) {
      throw new Error("No host defined for lightblue metadata service.");
    }
  }

  function _execute(request) {
    return $http[request.method](request.url, request.body);
  }

  this.getNames = function(statuses) {
    _checkClient()
    return _execute(_client.getNames(statuses));
  }

  this.getVersions = function(entityName) {
    _checkClient()
    return _execute(_client.getVersions(entityName));
  }

  this.getRoles = function(entityName, version) {
    _checkClient()
    return _execute(_client.getRoles(entityName, version));
  }

  this.getMetadata = function(entityName, version) {
    _checkClient()
    return _execute(_client.getMetadata(entityName, version));
  }

  this.setHost = function(host) {
    _client = lightblue.getMetadataClient(host);
  }

  this.unsetHost = function() {
    _client = undefined;
  };
}