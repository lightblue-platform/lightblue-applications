"use strict";

var dataManageControllers = angular.module("dataManageControllers", []);

(function () {
  // Returns an object that combines the request common and request body objects.
  function makeRequest(request) {
    return angular.extend({}, {
      objectType: request.common.entity,
      version: request.common.version
    }, request.body);
  }

  // Serializes the request.
  function getRequestRaw(request) {
    return JSON.stringify(makeRequest(request), null, "\t");
  }

  // Serializes the response.
  function getResponseRaw(response) {
    return JSON.stringify(response, null, "\t");
  }

  // Deserializes the raw json. If the raw string is invalid json, returns null.
  function tryParse(raw) {
    var req;

    try {
      req = JSON.parse(raw);
    } catch (e) {
      // Invalid json
      return null;
    }

    if (!(req instanceof Object)) {
      // Also invalid json
      return null;
    }

    return req;
  }

  dataManageControllers.controller("NavCtrl", ["$scope", "$location",
    function($scope, $location) {
      $scope.isActive = function(path) {
        return path === $location.path();
      }
    }]);

  // DataCtrl adds functions to scope that are shared among all views.
  dataManageControllers.controller("DataCtrl", ["$scope",
    function($scope) {
      $scope.configAce = function(editor) {
        editor.setShowPrintMargin(false);
        editor.setOption("maxLines", Infinity);
      };

      $scope.configResponseAce = function(editor) {
        editor.setReadOnly(true);
        $scope.configAce(editor);
      };
    }]);

  dataManageControllers.controller("FindCtrl", crudController("find", ["query", "projection"]));
  dataManageControllers.controller("InsertCtrl", crudController("insert", ["data", "projection"]));
  dataManageControllers.controller("SaveCtrl", crudController("save", ["data", "upsert", "projection"]));
  dataManageControllers.controller("UpdateCtrl", crudController("update", ["data", "update", "projection"]));
  dataManageControllers.controller("DeleteCtrl", crudController("delete", ["query"]));

  function crudController(op, properties) {
    return ["$scope", "lightblueDataService", "lightblueMetadataService", getServiceForOp(op),
        function($scope, dataService, metadataService, opService) {
          $scope.request = opService.request;
          $scope.response = opService.response;

          $scope.responseRaw = getResponseRaw($scope.response);

          $scope.loading = false;
          $scope.requestView = "builder";

          metadataService.getNames().success(function(data) {
            $scope.entities = data.entities;
          });

          $scope.$watch("request.common.entity", function(newEntity, oldEntity) {
            if (newEntity !== oldEntity) {
              delete $scope.versions;
              delete $scope.request.common.version;
            }

            if (newEntity === "" || !angular.isDefined(newEntity)) {
              return;
            }

            $scope.request.body.objectType = newEntity;

            metadataService.getVersions(newEntity).success(function(data) {
              $scope.versions = data;
            });
          });

          $scope.$watch("request.common.version", function(newVersion) {
            $scope.request.body.version = newVersion;
          });

          $scope.executeQuery = function() {
            $scope.loading = true;

            dataService[op](angular.extend({}, $scope.request.common, $scope.request.body))
              .success(function(data, status, headers) {
                angular.copy(data, $scope.response);
                $scope.responseRaw = getResponseRaw(data);
              })
              .finally(function() {
                $scope.loading = false;
              });
          };
      }];
  }

  function getServiceForOp(op) {
    return op + "Service";
  }
})();