function LightblueClient(host) {
  this.host = host;
}

LightblueClient.prototype.find = function(data) {
  return new FindRequest(this, data);
};

function LightblueRequest(client, method, data, url) {
  this.client = client;
  this.method = (typeof method === "string") ? method.toLowerCase() : "";
  this.METHOD = this.method.toUpperCase();
  this.data = data;
  this.url = url;
}

/**
 * @param data The JSON data of request
 */
function FindRequest(client, data) {
  var url = "";

  if (client instanceof Object && data instanceof Object) {
    url = client.host + "/data/find/" + data.entity;

    if (typeof data.version === "string") {
      url += "/" + data.version;
    }
  }

  LightblueRequest.call(this, client, "post", data, url);
}

FindRequest.prototype = new LightblueRequest();
FindRequest.prototype.constructor = FindRequest;