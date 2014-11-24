exports.resolve = function() {
  if (arguments.length === 0) {
    return "";
  }

  function trimSlashes(s) {
    if (typeof s !== "string") {
      return "";
    }

    s = s.replace(new RegExp("^/*"), "");
    s = s.replace(new RegExp("/*$"), "");

    return s;
  }

  function notEmpty(arg) {
    return typeof arg !== "undefined" && arg !== "";
  }

  return Array.prototype.slice.call(arguments, 0)
      .filter(notEmpty)
      .map(trimSlashes)
      .join("/");
}

exports.isEmpty = function(s) {
  return typeof s === "undefined" || s === "";
}