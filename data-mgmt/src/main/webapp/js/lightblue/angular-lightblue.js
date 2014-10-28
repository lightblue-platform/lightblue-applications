function AngularLightblue($http, host) {
  var _client = new LightblueClient(host);

  this.execute = function(request) {
    console.log(request);
    return $http[request.method](request.url, request.data);
  }

  this.find = function(data) {
    console.log(data);
    return this.execute(_client.find(data));
  }
}