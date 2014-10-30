"use strict";

var dataManageControllers = angular.module("dataManageControllers", []);

(function () {
  // Returns an object that combines the request common and request body objects.
  function makeRequest(request) {
    return angular.extend({}, request.common, request.body);
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
        editor.session.setOption("useWorker", false);

        $scope.configAce(editor);
      };
    }]);

  dataManageControllers.controller("FindCtrl", ["$scope", "lightblue", "findService",
    function($scope, lightblue, findService) {
      $scope.request = findService.request;
      $scope.response = findService.response;

      $scope.requestRaw = getRequestRaw($scope.request);
      $scope.responseRaw = getResponseRaw($scope.response);

      // Try and parse raw data into model.
      // There is probably a better way to do this.
      $scope.$watch('requestRaw', function(newValue) {
        var req = tryParse(newValue);

        if (req === null) {
          return;
        }

        $scope.request.common.entity = req.entity;
        $scope.request.common.version = req.version;

        $scope.request.body.query = req.query;
        $scope.request.body.projection = req.projection;
      });

      $scope.executeQuery = function() {
        lightblue.find(makeRequest($scope.request))
          .success(function(data, status, headers) {
            angular.copy(data, $scope.response);
            $scope.responseRaw = getResponseRaw(data);
          });
      };
    }]);

  dataManageControllers.controller("InsertCtrl", ["$scope", "lightblue", "insertService",
    function($scope, lightblue, insertService) {
      $scope.request = insertService.request;
      $scope.response = insertService.response;

      $scope.requestRaw = getRequestRaw($scope.request);
      $scope.responseRaw = getResponseRaw($scope.response);

      // Try and parse raw data into model.
      // There is probably a better way to do this.
      $scope.$watch('requestRaw', function(newValue) {
        var req = tryParse(newValue);

        if (req === null) {
          return;
        }

        $scope.request.common.entity = req.entity;
        $scope.request.common.version = req.version;

        $scope.request.body.data = req.data;
        $scope.request.body.projection = req.projection;
      });

      $scope.executeQuery = function() {
        lightblue.insert(makeRequest($scope.request))
          .success(function(data, status, headers) {
            angular.copy(data, $scope.response);
            $scope.responseRaw = getResponseRaw(data);
          });
      };
    }]);

  dataManageControllers.controller("SaveCtrl", ["$scope", "lightblue", "saveService",
    function($scope, lightblue, saveService) {
      $scope.request = saveService.request;
      $scope.response = saveService.response;

      $scope.requestRaw = getRequestRaw($scope.request);
      $scope.responseRaw = getResponseRaw($scope.response);

      // Try and parse raw data into model.
      // There is probably a better way to do this.
      $scope.$watch('requestRaw', function(newValue) {
        var req = tryParse(newValue);

        if (req === null) {
          return;
        }

        $scope.request.common.entity = req.entity;
        $scope.request.common.version = req.version;

        $scope.request.body.data = req.data;
        $scope.request.body.upsert = req.upsert;
        $scope.request.body.projection = req.projection;
      });

      $scope.executeQuery = function() {
        lightblue.save(makeRequest($scope.request))
          .success(function(data, status, headers) {
            angular.copy(data, $scope.response);
            $scope.responseRaw = getResponseRaw(data);
          });
      };
    }]);

  dataManageControllers.controller("UpdateCtrl", ["$scope", "lightblue", "updateService",
    function($scope, lightblue, updateService) {
      $scope.request = updateService.request;
      $scope.response = updateService.response;

      $scope.requestRaw = getRequestRaw($scope.request);
      $scope.responseRaw = getResponseRaw($scope.response);

      // Try and parse raw data into model.
      // There is probably a better way to do this.
      $scope.$watch('requestRaw', function(newValue) {
        var req = tryParse(newValue);

        if (req === null) {
          return;
        }

        $scope.request.common.entity = req.entity;
        $scope.request.common.version = req.version;

        $scope.request.body.query = req.query;
        $scope.request.body.update = req.update;
        $scope.request.body.projection = req.projection;
      });

      $scope.executeQuery = function() {
        lightblue.update(makeRequest($scope.request))
          .success(function(data, status, headers) {
            angular.copy(data, $scope.response);
            $scope.responseRaw = getResponseRaw(data);
          });
      };
    }]);

  dataManageControllers.controller("DeleteCtrl", ["$scope", "lightblue", "deleteService",
    function($scope, lightblue, deleteService) {
      $scope.request = deleteService.request;
      $scope.response = deleteService.response;

      $scope.requestRaw = getRequestRaw($scope.request);
      $scope.responseRaw = getResponseRaw($scope.response);

      // Try and parse raw data into model.
      // There is probably a better way to do this.
      $scope.$watch('requestRaw', function(newValue) {
        var req = tryParse(newValue);

        if (req === null) {
          return;
        }

        $scope.request.common.entity = req.entity;
        $scope.request.common.version = req.version;

        $scope.request.body.query = req.query;
      });

      $scope.executeQuery = function() {
        lightblue.delete(makeRequest($scope.request))
          .success(function(data, status, headers) {
            angular.copy(data, $scope.response);
            $scope.responseRaw = getResponseRaw(data);
          });
      };
    }]);
})();