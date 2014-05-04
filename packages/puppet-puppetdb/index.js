var getNodesAll = function(puppetDBHost, puppetDBPort, puppetDBAPIVersion) {
  
  puppetDBHost        = puppetDBHost || 'localhost';
  puppetDBPort        = puppetDBPort || 8080;
  puppetDBAPIVersion  = puppetDBAPIVersion || 'v3';
  
}

var getAllFactNames = function() {
  throw new Error('Not implemented yet');
}

exports.getAllFactNames = getAllFactNames;
exports.getNodesAll = getNodesAll;
