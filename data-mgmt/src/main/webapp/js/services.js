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
    return new AngularLightblue($http, _host);
  }];
});