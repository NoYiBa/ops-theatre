/**
 * Hiera backend controller.
 *
 * @module hiera/controllers/backend
 * @author rajkissu <rajkissu@gmail.com>
 */
/* jslint node: true */
"use strict";

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
  hiera.getBackends(config.hiera.configFile, function (err, backends) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(backends);
  });
}

/**
 * Get configuration for a specific hiera backend.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function get(req, res) {
  var backend = req.params.backend;
  hiera.getBackendConfig(config.hiera.configFile, backend, function (err, data) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(data);
  });
}
