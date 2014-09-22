/**
 * Hiera file controller.
 *
 * @module hiera/controllers/file
 * @author rajkissu <rajkissu@gmail.com>
 */
'use strict';

var hiera, common, config;

hiera  = require('puppet-hiera');
common = require('../../../lib/common');
config = require('../../../config.json');

module.exports = {
  getAll : getAll,
  get    : get,
  save   : save
};

/**
 * Get a list of Hiera files.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getAll(req, res) {
  var backend = hiera.getBackendConfig(
    config.hiera.configFile,
    req.params.backend
  );

  common.getFileTree(backend[':datadir'], function (err, files) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(files);
  });
}

/**
 * Get contents of a Hiera file.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function get(req, res) {
  var backend, file;

  backend = req.params.backend;
  file    = hiera.getFile(config.hiera.configFile, backend, req.params[0]);

  res.send(file);
}

/**
 * Save contents to a Hiera file.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function save(req, res) {
  var backend, data;

  backend = req.params.backend;
  data    = req.body.data;

  hiera.saveFile(config.hiera.configFile, backend, req.params[0], data, function (err) {
    if (err) {
      res.status(500);
      res.send(err);
    }

    res.send(200);
  });
}
