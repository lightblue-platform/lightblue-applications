"use strict";

var dataManageDirectives = angular.module("dataManageDirectives", []);

dataManageDirectives.directive("lbJsonEditor", function() {
  return {
    restrict: "E",
    require: "ngModel",
    scope: {
      object: "@",
      mode: "@",
      //modes: "@", TODO: follow up on worker mem leak
      search: "=",
      aceConfig: "="
    },
    link: function($scope, element, attributes, ngModel) {
      element.css("display", "block");

      var oldMode;

      function isNewMode(mode) {
        if (oldMode === editor.mode) {
          return false;
        }

        oldMode = editor.mode;
        return (mode) ? oldMode === mode : true;
      }

      var editor = new JSONEditor(element[0], {
        change: function() {
          // Change is called on code mode before constructor returns, so do nothing in that case.
          if (typeof editor === "undefined") {
            return;
          }

          // Call ace on load call each time mode is switched
          if (isNewMode("code") && editor.editor && $scope.aceConfig && $scope.aceConfig.onLoad) {
            $scope.aceConfig.onLoad(editor.editor);
          }

          // Parsing model may fail if in text or code mode.
          try {
            $scope.model = editor.get();
            ngModel.$setViewValue($scope.model);
          } catch (e) {
            return;
          }
        },
        name: $scope.object,
        mode: $scope.mode,
        modes: $scope.modes ? $scope.modes.split(",") : undefined,
        search: angular.isDefined($scope.search) ? $scope.search : true
      });

      if (editor.editor && $scope.aceConfig && $scope.aceConfig.onLoad) {
        $scope.aceConfig.onLoad(editor.editor);
      }

      // Won't trigger on changes, but necessary for initial update.
      ngModel.$render = function() {
        $scope.model = ngModel.$viewValue;
      };

      $scope.$watch("model", function(newValue) {
        // Avoid updating the editor unnecessarily, which disrupts user input.
        // TODO: optimize? angular.equals is expensive, so is deep watch
        if (angular.equals(newValue, editor.get())) {
          return;
        }

        // TODO: deal with triggering change event, which redundantly sets view value on model
        editor.set(newValue);

        if(editor.expandAll) {
          editor.expandAll();
        }
      }, true);
    }
  };
})