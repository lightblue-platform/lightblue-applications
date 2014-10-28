"use strict";

var dataManageApp = angular.module("dataManageApp", [
  "ngRoute",
  "dataManageControllers",
  "dataManageServices",
  "ui.ace"
]);

dataManageApp.config(["$routeProvider", function($routeProvider) {
  $routeProvider.
    when("/find", {
      templateUrl: "partials/find.html",
      controller: "FindCtrl"
    })
    .otherwise({
      redirectTo: "/find"
    });
}]);

dataManageApp.config(["lightblueProvider", function(lightblueProvider) {
  lightblueProvider.setLightblueHost("http://localhost/~ahenning/app/data/lightblue-request");
}]);