"use strict";

var dataManageControllers = angular.module("dataManageControllers", ["dataManageFilters"]);

(function() {
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

  dataManageControllers.controller("FindCtrl", crudController("find", ["query", "projection", "sort", "range"]));
  dataManageControllers.controller("InsertCtrl", crudController("insert", ["data", "projection"]));
  dataManageControllers.controller("SaveCtrl", crudController("save", ["data", "upsert", "projection"]));
  dataManageControllers.controller("UpdateCtrl", crudController("update", ["query", "update", "projection"]));
  dataManageControllers.controller("DeleteCtrl", crudController("delete", ["query"]));

  function crudController(view, properties) {
    function makeLightblueRequest(requestBody) {
      var request = {
        entity: requestBody.objectType,
        version: requestBody.version
      };

      properties.forEach(function(prop) {
        request[prop] = requestBody[prop];
      });

      return request;
    }

    return ["$scope", "lightblueDataService", "lightblueMetadataService", getServiceForView(view), "emptyFilter",
        function($scope, dataService, metadataService, viewService, emptyFilter) {
          $scope.request = viewService.request;
          $scope.response = viewService.response;

          $scope.loading = false;
          $scope.requestView = "builder";

          metadataService.getNames().success(function(data) {
            $scope.entities = data.entities;
          });

          $scope.$watch("request.body.objectType", function(newEntity, oldEntity) {
            if (newEntity !== oldEntity) {
              delete $scope.versions;
            }

            if (newEntity === "" || !angular.isDefined(newEntity)) {
              return;
            }

            $scope.request.body.objectType = newEntity;

            metadataService.getVersions(newEntity).success(function(data) {
              $scope.versions = data;

              // Reset version value if not valid
              if ($scope.request.body.version !== "" && 
                data.map(function(v) { return v.version; })
                    .indexOf($scope.request.body.version) === -1) {
                $scope.request.body.version = "";
              }
            });
          });

          $scope.getMetadata = function() {
            metadataService.getMetadata($scope.request.body.objectType, $scope.request.body.version)
              .success(function(data, status, headers) {
                angular.copy(data, $scope.response);
              });
          };

          $scope.executeQuery = function() {
            $scope.loading = true;

            var config = makeLightblueRequest(emptyFilter($scope.request.body));
            
            dataService[view](config)
              .success(function(data, status, headers) {
                angular.copy(data, $scope.response);
              })
              .finally(function() {
                $scope.loading = false;
              });
          };

          var requestRaw = {};

          function getRequestRaw() {
            return emptyFilter(angular.copy($scope.request.body, requestRaw), true);
          }

          function setRequestRaw(requestBody) {
            $scope.request.body.objectType = getOrDefault(requestBody, "objectType");
            $scope.request.body.version = getOrDefault(requestBody, "version");

            properties.forEach(function(prop) {
              $scope.request.body[prop] = getOrDefault(requestBody, prop);
            });
          }

          function getOrDefault(requestBody, prop) {
            if (angular.isDefined(requestBody[prop])) {
              return requestBody[prop];
            } else {
              return viewService.newRequestBody()[prop];
            }
          }

          $scope.requestRaw = function(requestBody) {
            if (angular.isUndefined(requestBody)) {
              return getRequestRaw();
            }

            setRequestRaw(requestBody);
          };

          $scope.reset = viewService.reset;

          if (typeof custom === "function") {
            custom($scope);
          }
      }];
  }

  function getServiceForView(view) {
    return view + "Service";
  }
})();