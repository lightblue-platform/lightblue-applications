var util        = require("./clientutil");
var RestRequest = require("./rest").RestRequest;

module.exports = LightblueMetadataClient;

/**
 * Client for making requests against a Lightblue data endpoint.
 * @constructor
 * @param {String} host - The URL where the rest data server is deployed. This 
 *     path will be the base for requests, like ${host}/find, so if the app is
 *     deployed under a particular context (like /rest/data), this must be 
 *     included in the host.
 */
function LightblueMetadataClient(host) {
  this.host = host;
}

/**
 * Request entity names of certain statuses.
 * @param  {String[]} [statuses] An optional array of statuses to reduce the 
 *     search to.
 */
LightblueMetadataClient.prototype.getNames = function(statuses) {
  return new NamesRequest(this.host, statuses);
};

/**
 * Request the versions available for a particular entity.
 * @param  {String} entityName
 */
LightblueMetadataClient.prototype.getVersions = function(entityName) {
  return new VersionsRequest(this.host, entityName);
};

/**
 * Returns the metadata details for the specified version of an entity.
 * @param  {String} entityName Name of the entity.
 * @param  {String} version    Version (required).
 */
LightblueMetadataClient.prototype.getMetadata = function(entityName, version) {
  return new MetadataRequest(this.host, entityName, version);
};

/**
 * Request the roles available for all entities, or a particular entity, or a 
 * particular version of an entity.
 * @param  {String} [entityName]
 * @param  {String} [version]
 */
LightblueMetadataClient.prototype.getRoles = function(entityName, version) {
  return new RolesRequest(this.host, entityName, version);
};

function NamesRequest(host, statuses) {
  var query = (statuses && statuses.length > 0)
      ? "s=" + statuses.join(",")
      : "";

  RestRequest.call(this, "get", util.resolve(host, query));
}

NamesRequest.prototype = Object.create(RestRequest.prototype);
NamesRequest.prototype.constructor = NamesRequest;

function VersionsRequest(host, entityName) {
  if (util.isEmpty(entityName)) {
    throw new Error("entityName required for versions request.")
  }

  RestRequest.call(this, "get", util.resolve(host, entityName));
}

VersionsRequest.prototype = Object.create(RestRequest.prototype);
VersionsRequest.prototype.constructor = VersionsRequest;

function RolesRequest(host, entityName, version) {
  RestRequest.call(this, "get", util.resolve(host, entityName, version, "roles"));
}

RolesRequest.prototype = Object.create(RestRequest.prototype);
RolesRequest.prototype.constructor = RolesRequest;

function MetadataRequest(host, entityName, version) {
  if (util.isEmpty(entityName) || util.isEmpty(version)) {
    throw new Error("entityName and version required for metadata request.")
  }

  RestRequest.call(this, "get", util.resolve(host, entityName, version));
}