"use strict";

var datamgmt = angular.module("datamgmt", [
  // Angular
  "ngRoute",
  "ngSanitize",

  // datamgmt
  "dataManageControllers",
  "dataManageServices",
  "lightblueServices",

  // 3rd party
  "ui.ace",
  "ui.select"
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
    .otherwise({
      redirectTo: "/find"
    });
}]);

datamgmt.config(["lightblueDataServiceProvider", function(dataServiceProvider) {
  dataServiceProvider.setHost("/rest-request/data/");
}]);

datamgmt.config(["lightblueMetadataServiceProvider", function(metadataServiceProvider) {
  metadataServiceProvider.setHost("/rest-request/metadata/");
}]);
