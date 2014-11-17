var lightblueServices = angular.module("lightblueServices", []);

lightblueServices.provider("lightblueDataService", function() {
  var _host = "";

  this.setHost = function(host) {
    _host = host;
  }

  this.getHost = function() {
    return _host;
  }

  this.$get = ["$http", function($http) {
    return new NgLightblueDataClient($http, _host);
  }];
});

lightblueServices.provider("lightblueMetadataService", function() {
  var _host = "";

  this.setHost = function(host) {
    _host = host;
  }

  this.getHost = function() {
    return _host;
  }

  this.$get = ["$http", function($http) {
    return new NgLightblueMetadataClient($http, _host);
  }];
});

function NgLightblueDataClient($http, host) {
  var _client = lightblue.getDataClient(host);

  function _execute(request) {
    return $http[request.method](request.url, request.body);
  }

  this.find = function(config) {
    return _execute(_client.find(config));
  }

  this.insert = function(data) {
    return _execute(_client.insert(config));
  }

  this.save = function(data) {
    return _execute(_client.save(config));
  }

  this.update = function(data) {
    return _execute(_client.update(config));
  }

  this.delete = function(data) {
    return _execute(_client.delete(config));
  }
}

function NgLightblueMetadataClient($http, host) {
  var _client = lightblue.getMetadataClient(host);

  function _execute(request) {
    return $http[request.method](request.url, request.body);
  }
  
  this.getNames = function(statuses) {
    return _execute(_client.getNames(statuses));
  }

  this.getVersions = function(entityName) {
    return _execute(_client.getVersions(entityName));
  }

  this.getRoles = function(entityName, version) {
    return _execute(_client.getRoles(entityName, version));
  }

  this.getMetadata = function(entityName, version) {
    return _execute(_client.getMetadata(entityName, version));
  }
}