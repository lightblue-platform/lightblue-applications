exports.RestRequest = function(method, url, body) {
  this.method = (typeof method === "string") ? method.toLowerCase() : "";
  this.METHOD = this.method.toUpperCase();
  this.body = body;
  this.url = url;
}