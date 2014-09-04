'use strict';

var hiera, config;

hiera = require('puppet-hiera');
config = require(__dirname + '/../../app.json');

module.exports = {
  getHiera      : getHiera,
  getHierarchy  : getHierarchy,
  getBackendAll : getBackendAll,
  getBackend    : getBackend,
  saveHiera     : saveHiera
};

// get the entire hiera configuration
function getHiera(req, res) {
  res.send(hiera.getConfig(config.hiera.configFile));
}

// get hiera hierarchy
function getHierarchy(req, res) {
  res.send(hiera.getHierarchy(config.hiera.configFile));
}

// get all hiera backends
function getBackendAll(req, res) {
  res.send(hiera.getBackends(config.hiera.configFile));
}

// get configuration for a specific hiera backend
function getBackend(req, res) {
  var backend = req.params.backend;
  res.send(hiera.getBackendConfig(config.hiera.configFile, backend));
}

function saveHiera(req, res) {
  var ret = hiera.saveConfig(config.hiera.configFile, req.body);
  res.send(200);
}
