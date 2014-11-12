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

  dataManageControllers.controller("FindCtrl", crudController("find", ["query", "projection"]));
  dataManageControllers.controller("InsertCtrl", crudController("insert", ["data", "projection"]));
  dataManageControllers.controller("SaveCtrl", crudController("save", ["data", "upsert", "projection"]));
  dataManageControllers.controller("UpdateCtrl", crudController("update", ["data", "update", "projection"]));
  dataManageControllers.controller("DeleteCtrl", crudController("delete", ["query"]));

  function crudController(op, properties) {
    return ["$scope", "lightblue", getServiceForOp(op), function($scope, lightblue, service) {
      $scope.request = service.request;
      $scope.response = service.response;

      $scope.requestRaw = getRequestRaw($scope.request);
      $scope.responseRaw = getResponseRaw($scope.response);

      $scope.loading = false;

      // Try and parse raw data into model.
      // There is probably a better way to do this.
      $scope.$watch('requestRaw', function(newValue) {
        var req = tryParse(newValue);

        if (req === null) {
          return;
        }

        $scope.request.common.entity = req.entity;
        $scope.request.common.version = req.version;

        for (var i = 0; i < properties.length; i++) {
          var prop = properties[i];
          $scope.request.body[prop] = req[prop];
        }
      });

      $scope.executeQuery = function() {
        $scope.loading = true;

        lightblue[op](makeRequest($scope.request))
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