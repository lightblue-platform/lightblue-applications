"use strict";

var datamgmt = angular.module("datamgmt", [
  // Angular
  "ngRoute",
  "ngSanitize",

  // datamgmt
  "dataManageControllers",
  "dataManageServices",
  "dataManageDirectives",
  "dataManageFilters",
  "lightblueServices",

  // 3rd party
  "ui.select",
  "ui.bootstrap"
]);

datamgmt.config(["$routeProvider", function($routeProvider) {
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
    .when("/environments", {
      templateUrl: "partials/environments.html",
      controller: "EnvironmentsCtrl"
    })
    .otherwise({
      redirectTo: "/find"
    });
}]);

// Use in production
/*
datamgmt.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);
*/