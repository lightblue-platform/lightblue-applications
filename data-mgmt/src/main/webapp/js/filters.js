"use strict";

var dataManageFilters = angular.module("dataManageFilters", []);

dataManageFilters.filter("empty", function() {
  function isEmptyArray(arr) {
    var filtered = arr.filter(function(value) {
      return value !== null && typeof value !== "undefined" && value !== "";
    });

    return filtered.length === 0;
  }

  function isEmptyObject(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (angular.isDefined(obj[key])) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Removes empty and effectively empty objects and arrays from some input 
   * object. Can return modification as a new object, or it can be done in place
   * with side effects.
   * @param {Object} input - Source object.
   * @param {Boolean} modifyInPlace - If true, source object itself will be 
   *     modified;
   * @return {Object} - The modified object
   */
  return function filterEmpty(input, modifyInPlace) {
    var out = modifyInPlace ? input : angular.copy(input);

    for(var key in out) {
      if (out.hasOwnProperty(key)) {
        var value = out[key];

        if (angular.isArray(value) && isEmptyArray(value)) {
          delete out[key];
        } else if (angular.isObject(value)) {
          value = filterEmpty(value);

          if (isEmptyObject(value)) {
            delete out[key];
          }
        }
      }
    }

    return out;
  };
});