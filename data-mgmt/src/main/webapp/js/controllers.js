"use strict";

var dataManageControllers = angular.module("dataManageControllers", []);

dataManageControllers.controller("FindCtrl", ["$scope", "lightblue",
  function($scope, lightblue) {
    $scope.requestCommon = {
      entity: ""
    };

    $scope.requestBody = {
      query: {},
      projection: {}
    };

    $scope.requestRaw = JSON.stringify(
      angular.extend({}, $scope.requestCommon, $scope.requestBody),
      null, "\t");

    // Try and parse raw data into model.
    // There is probably a better way to do this.
    $scope.$watch('requestRaw', function(newValue) {
      try {
        var req = JSON.parse(newValue);
      } catch (e) {
        // Invalid json
        return;
      }

      if (!(req instanceof Object)) {
        // Also invalid json
        return;
      }

      $scope.requestCommon.entity = req.entity;
      $scope.requestCommon.version = req.version;

      $scope.requestBody.query = req.query;
      $scope.requestBody.projection = req.projection;
    });

    $scope.configAce = function(editor) {
      editor.setShowPrintMargin(false);
      editor.setOption("maxLines", Infinity);
    };

    $scope.configResponseAce = function(editor) {
      editor.setReadOnly(true);
      editor.session.setOption("useWorker", false);

      $scope.configAce(editor);
    };

    $scope.executeQuery = function() {
      lightblue.find(angular.extend({}, $scope.requestCommon, $scope.requestBody))
        .success(function(data, status, headers) {
          $scope.responseRaw = JSON.stringify(data, null, "\t");
        });
    };
  }]);