'use strict';

var fs, puppetDB;

fs       = require('fs');
puppetDB = require('puppet-puppetdb');

module.exports = function PuppetDB(app) {
  app.get('/puppetdb/nodes', getNodes);
  app.get('/puppetdb/fact-names', getFactNames);
  app.get('/puppetdb/nodes/:node/facts', getNodeFacts);
  app.get('/puppetdb/facts/:fact', getFact);
};

// Get a list of nodes known to puppetdb
function getNodes(req, res) {
  puppetDB.getAllNodes(config.puppetdb, function (error, data) {
      res.send(data);
    });
}

// Get a list of all fact names known to puppetdb
function getFactNames(req, res) {
  puppetDB.getAllFactNames(config.puppetdb, function (error, data) {
      res.send(data);
    });
}

// Get the last stored facts for a node known to puppetdb
function getNodeFacts(req, res) {
  var node = req.params.node;

  puppetDB.getNodeFacts(config.puppetdb, node, function (error, data) {
    res.send(data);
  });
}

// Get all values for a specific fact known to puppetdb
function getFact(req, res) {
  var fact = req.params.fact;
  puppetDB.getAllFactValues(config.puppetdb, fact, function (error, data) {
      res.send(data);
    });
}
