"use strict";

var dataManageDirectives = angular.module("dataManageDirectives", []);

dataManageDirectives.directive("requestCommon", function() {
  return {
    restrict: "E",
    templateUrl: "templates/common.html"
  };
});

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

          // Ace code editor is present
          if (editor.editor) {
            if (isNewMode("code") && $scope.aceConfig && $scope.aceConfig.onLoad) {
              $scope.aceConfig.onLoad(editor.editor);
            }

            // Don't trigger model updates if not focused.
            if (!editor.editor.isFocused()) {
              return;
            }
          }

          console.log("change", attributes.ngModel);
          $scope.$evalAsync(read);
        },
        name: $scope.object,
        mode: $scope.mode,
        modes: $scope.modes ? $scope.modes.split(",") : undefined,
        search: angular.isDefined($scope.search) ? $scope.search : true
      });

      function read() {
        try {
          $scope.model = editor.get();
          ngModel.$setViewValue($scope.model);
        } catch (e) {
          return;
        };
      }

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
        try {
          if (angular.equals(newValue, editor.get())) {
            return;
          }
        } catch (ignored) {
          // Editor's current content is not valid JSON, fall through to 
          // overwrite with new model value.
        }

        // TODO: deal with triggering change event, which redundantly sets view value on model
        console.log("editor.set", attributes.ngModel);
        editor.set(newValue);

        if(editor.expandAll) {
          editor.expandAll();
        }
      }, true);
    }
  };
})