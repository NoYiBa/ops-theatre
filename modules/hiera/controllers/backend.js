'use strict';

var hiera, config;

hiera  = require('puppet-hiera');
config = require('../../../config.json');

module.exports = {
  getAll : getAll,
  get    : get
};

// get all hiera backends
function getAll(req, res) {
  res.send(hiera.getBackends(config.hiera.configFile));
}

// get configuration for a specific hiera backend
function get(req, res) {
  var backend = req.params.backend;
  res.send(hiera.getBackendConfig(config.hiera.configFile, backend));
}
