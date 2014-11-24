var DataClient     = require("./data.js");
var MetadataClient = require("./metadata.js");
var query          = require("./query.js");

var resolve = require("./clientutil.js").resolve;

exports.getDataClient = getDataClient;
exports.getMetadataClient = getMetadataClient;
exports.getClient = getClient;
exports.field = query.field;

function LightblueClient(dataClient, metadataClient) {
  this.data = dataClient;
  this.metadata = metadataClient;
}

/**
 * Returns a LightblueDataClient.
 * @param  {String} dataHost The full path for the base Lightblue data REST 
 *     context.
 * @return {LightblueDataClient}
 */
function getDataClient(dataHost) {
  return new DataClient(dataHost);
}

function getMetadataClient(metadataHost) {
  return new MetadataClient(metadataHost);
}

function getClient(dataHost, metadataHost) {
  if (typeof metadataHost === "undefined") {
    dataHost = resolve(dataHost, "data");
    metadataHost = resolve(dataHost, "metadata");
  }

  var dataClient = getDataClient(dataHost);
  var metadataClient = getMetadataClient(metadataHost);

  return new LightblueClient(dataClient, metadataClient);
}