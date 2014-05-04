'use strict';

var express = require('express');
var puppetHiera = require('puppet-hiera');
var puppetFacter = require('puppet-facter');
var puppetDB = require('puppet-puppetdb');
var config = require('./config.json');

var app = express();

// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

// Return hello world :)
app.get('/', function(req, res){
  res.send('hello world');
});

// Get all hiera hierarchies
app.get('/hiera/hierarchies', function(req, res){
  res.send(puppetHiera.getHieraHierarchies(config.hiera.configfile));
});

// Get all hiera backends
app.get('/hiera/backends', function(req, res){
  res.send(puppetHiera.getHieraBackends(config.hiera.configfile));
});

// get the configuration for a specific hiera backend
app.get('/hiera/backendconfig/:backend', function(req, res){
  var backend = req.params.backend;
  res.send(puppetHiera.getHieraBackendConfig(config.hiera.configfile, backend));
});

// Get all facts from the server. Set :names to 'names' in order to retrieve 
// just fact names without values
app.get('/facter/all/:names', function(req, res, next){
    var namesOnly = req.params.names == 'names';
    puppetFacter.getFacts(namesOnly, function(err, data) {
      res.send(data);
    });  
});

// Get a specific fact from facter.
app.get('/facter/:fact', function(req, res, next){
  var fact = req.params.fact;
  puppetFacter.getFact(fact, function(err, data) {
    res.send(data);
  });  
});

// Get a list of nodes known to puppetdb
app.get('/puppetdb/nodes/all', function(req, res){
  puppetDB.getAllNodes(config.puppetdb, function(error, data) {
      res.send(data);
    });
});

// Get a list of all fact names known to puppetdb
app.get('/puppetdb/fact-names', function(req, res){
  puppetDB.getAllFactNames(config.puppetdb, function(error, data) {
      res.send(data);
    });
});

// Get the last stored facts for a node known to puppetdb
app.get('/puppetdb/nodes/:node/facts', function(req, res){
  var node = req.params.node;
  puppetDB.getNodeFacts(config.puppetdb, node, function(error, data) {
      res.send(data);
    });
});

// Get all values for a specific fact known to puppetdb
app.get('/puppetdb/facts/:fact', function(req, res){
  var fact = req.params.fact;
  puppetDB.getAllFactValues(config.puppetdb, fact, function(error, data) {
      res.send(data);
    });
});


app.listen(config.listen_port);

