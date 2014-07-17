'use strict';

var hiera = require('puppet-hiera');

module.exports = function Hiera(app) {
  app.get('/hiera/hierarchies', getHierarchyAll);
  app.get('/hiera/backends', getBackendAll);
  app.get('/hiera/backends/:backend', getBackend);
};

// Get all hiera hierarchies
function getHierarchyAll(req, res) {
  res.send(puppetHiera.getHieraHierarchies(config.hiera.configfile));
}

// Get all hiera backends
function getBackendAll(req, res) {
  res.send(puppetHiera.getHieraBackends(config.hiera.configfile));
}

// get configuration for a specific hiera backend
function getBackend(req, res) {
  var backend = req.params.backend;
  res.send(puppetHiera.getHieraBackendConfig(config.hiera.configfile, backend));
}
