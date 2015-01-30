/**
 * Hiera override controller.
 *
 * @module hiera/controllers/override
 * @author rajkissu <rajkissu@gmail.com>
 */
/* jslint node: true */
"use strict";

var hiera, config;

hiera  = require('puppet-hiera');
config = require('../../../config.json');

module.exports = {
  get : get
};

/**
 * Get overrides for a given Hiera file (if any).
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function get(req, res) {
  var backend, file;

  backend = req.params.backend;
  file    = req.params[0];

  hiera.getOverrides(config.hiera.configFile, backend, file, function (err, list) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(list);
  });
}
