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
    .when("/insert", {
      templateUrl: "partials/insert.html",
      controller: "InsertCtrl"
    })
    .when("/save", {
      templateUrl: "partials/save.html",
      controller: "SaveCtrl"
    })
    .when("/update", {
      templateUrl: "partials/update.html",
      controller: "UpdateCtrl"
    })
    .when("/delete", {
      templateUrl: "partials/delete.html",
      controller: "DeleteCtrl"
    })
    .otherwise({
      redirectTo: "/find"
    });
}]);

dataManageApp.config(["lightblueProvider", function(lightblueProvider) {
  lightblueProvider.setLightblueHost("http://localhost/~ahenning/app/data/lightblue-request");
}]);