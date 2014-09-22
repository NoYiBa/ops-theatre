/**
 * Hiera backend controller.
 *
 * @module hiera/controllers/backend
 * @author rajkissu <rajkissu@gmail.com>
 */
'use strict';

var hiera, config;

hiera  = require('puppet-hiera');
config = require('../../../config.json');

module.exports = {
  getAll : getAll,
  get    : get
};

/**
 * Get all hiera backends.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getAll(req, res) {
  res.send(hiera.getBackends(config.hiera.configFile));
}

/**
 * Get configuration for a specific hiera backend.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function get(req, res) {
  var backend = req.params.backend;
  res.send(hiera.getBackendConfig(config.hiera.configFile, backend));
}
