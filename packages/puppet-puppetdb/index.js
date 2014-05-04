var request = require('request');

var getPuppetDBURI = function(connection) {

  puppetDBHost        = connection.host || 'localhost';
  puppetDBPort        = connection.port || 8080;
  puppetDBAPIVersion  = connection.apiversion || 'v4';
  puppetDBUseSSL      = connection.usessl || false;

  if (puppetDBUseSSL) {
    protocol = 'https://';
  } else {
    protocol = 'http://';
  }
  
  return(protocol + puppetDBHost + ':' + puppetDBPort + '/' + puppetDBAPIVersion + '/');

}

var puppetDBQuery = function(querystring, connection, callback) {

  url = getPuppetDBURI(connection);

  request.get(url + querystring, function(error, response, body) {
    if (error) return callback(error);
    return callback(null, JSON.parse(body));

  });
}

var getAllNodes = function(connection, callback) {
  return puppetDBQuery('nodes', connection, callback);
}

var getNodeFacts = function(connection, nodename, callback) {
  return puppetDBQuery('nodes/' + nodename + '/facts', connection, callback);
}

var getAllFactNames = function(connection, callback) {
  return puppetDBQuery('fact-names', connection, callback);
}

var getAllFactValues = function(connection, factname, callback) {
  return puppetDBQuery('facts/' + factname, connection, callback);
}

exports.getAllFactNames   = getAllFactNames;
exports.getAllFactValues  = getAllFactValues;
exports.getAllNodes       = getAllNodes;  
exports.getNodeFacts      = getNodeFacts; 