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
  dataManageControllers.controller("DataCtrl", ["$scope", "$location", 
      "environmentService", "lightblueDataService", "lightblueMetadataService",
    function($scope, $location, environmentService, dataService, metadataService) {
      $scope.configAce = function(editor) {
        editor.setShowPrintMargin(false);
        editor.setOption("maxLines", Infinity);
      };

      $scope.configResponseAce = function(editor) {
        editor.setReadOnly(true);
        $scope.configAce(editor);
      };

      $scope.environments = environmentService.getEnvironments();

      $scope.setEnvironment = function(env) {
        $scope.environment = env;
        dataService.setHost(env.dataHost);
        metadataService.setHost(env.metadataHost);
      };

      $scope.unsetEnvironment = function() {
        delete $scope.environment;
        dataService.unsetHost();
        metadataService.unsetHost();
      }

      $scope.setEnvironmentByAlias = function(alias) {
        var envs = $scope.environments.filter(function(e) { return e.alias === alias; });

        if (envs.length === 0) {
          throw new Error("No environment defined by alias, " + alias);
        }

        $scope.setEnvironment(envs[0]);
      };

      $scope.isEnvironmentSelected = function() {
        return angular.isDefined($scope.environment);
      };

      $scope.redirectToManageEnvironments = function() {
        $location.path("/environments");
      };
    }]);

  dataManageControllers.controller("EnvironmentsCtrl", ["$scope", "environmentService",
    function($scope, environmentService) {
      function getFormData() {
        return {
          alias: $scope.alias,
          dataHost: $scope.dataHost,
          metadataHost: $scope.metadataHost
        };
      }

      function clearForm() {
        delete $scope.alias;
        delete $scope.dataHost;
        delete $scope.metadataHost;
        $scope.addEnvironmentForm.$setPristine();
      }

      $scope.addEnvironment = function() {
        var env = getFormData();

        environmentService.addEnvironment(env);
        $scope.environments.push(env);

        if (!$scope.isEnvironmentSelected()) {
          $scope.setEnvironment(env);
        }

        clearForm();
      };

      $scope.removeEnvironment = function(env) {
        environmentService.removeEnvironment(env);

        $scope.environments.splice($scope.environments.indexOf(env), 1);

        if ($scope.isEnvironmentSelected() && $scope.environment.alias === env.alias) {
          $scope.unsetEnvironment();
        }
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

    return ["$scope", "lightblueDataService", "lightblueMetadataService", getServiceForView(view), "emptyFilter", "util",
        function($scope, dataService, metadataService, viewService, emptyFilter, util) {
          if (!$scope.isEnvironmentSelected()) {
            $scope.redirectToManageEnvironments();
            return;
          }

          $scope.request = viewService.request;
          $scope.response = viewService.response;

          $scope.loading = false;
          $scope.requestView = "builder";

          $scope.$watch("environment", function() {
            metadataService.getNames().success(function(data) {
              $scope.entities = data.entities;
            });
          });

          $scope.$watch("request.body.objectType", function(newEntity, oldEntity) {
            if (newEntity !== oldEntity) {
              delete $scope.versions;
            }

            if (newEntity === "" || !angular.isDefined(newEntity)) {
              $scope.request.body.version = "";
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

            function updateResponse(data, status, headers) {
              var contentType = headers("Content-Type");

              if (typeof contentType === "string" 
                  && contentType.indexOf("application/json") === 0) {
                angular.copy(data, $scope.response);
              } else {
                $scope.response = "Non-json response received, status code: " + status + "\n" +
                    "This usually indicates a problem with the application.\n" +
                    "Please open an issue: https://github.com/lightblue-platform/lightblue-applications/issues/new";
              }
            }

            dataService[view](config)
              .success(updateResponse)
              .error(updateResponse)
              .finally(function() {
                $scope.loading = false;
              });
          };

          var requestRaw = {};

          function getRequestRaw() {
            return emptyFilter(angular.copy($scope.request.body, requestRaw), true);
          }

          function setRequestRaw(requestBody) {
            var oldObjectType = $scope.request.body.objectType;
            $scope.request.body.objectType = getOrDefault(requestBody, "objectType");

            // Only set version if it is valid or if we've also changed the
            // objectType (in which case whether the version is valid or not is
            // determined after the getVersions callback for the new objectType)
            if(oldObjectType !== $scope.request.body.objectType ||
              (!$scope.versions || !requestBody ||
                util.arrayContains(
                  $scope.versions.map(function(v) { return v.version; }),
                  requestBody.version))) {
              $scope.request.body.version = getOrDefault(requestBody, "version");
            }

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