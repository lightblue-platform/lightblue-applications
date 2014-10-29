function NgLightblue($http, host) {
  var _client = new LightblueClient(host);

  this.execute = function(request) {
    console.log(request);
    return $http[request.method](request.url, request.data);
  }

  this.find = function(data) {
    return this.execute(_client.find(data));
  }

  this.insert = function(data) {
    return this.execute(_client.insert(data));
  }

  this.save = function(data) {
    return this.execute(_client.save(data));
  }

  this.update = function(data) {
    return this.execute(_client.update(data));
  }

  this.delete = function(data) {
    return this.execute(_client.delete(data));
  }
}