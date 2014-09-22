/**
 * Core opsModules controller.
 *
 * @module core/controllers/opsModules
 * @author rajkissu <rajkissu@gmail.com>
 */
'use strict';

var modules = require('../../../lib/modules');

module.exports = {
  getAll : getAll,
  get    : get
};

/**
 * Retrieves a list of all OpsTheatre modules.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getAll(req, res) {
  var m = modules._modules;
  res.send(m);
}

/**
 * Get configuration for a specific module.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function get(req, res) {
  var name, mods;

  name = req.params.module;
  m    = modules._modules[name];

  if (m) {
    res.send(m);
  } else {
    res.send(404);
  }
}
