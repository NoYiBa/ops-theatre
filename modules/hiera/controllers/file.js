/**
 * Hiera file controller.
 *
 * @module hiera/controllers/file
 * @author rajkissu <rajkissu@gmail.com>
 */
/* jslint node: true */
"use strict";

var async, hiera, common, config;

async  = require('async');
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
  var backend = req.params.backend;

  async.waterfall([
    function (cb) {
      hiera.getBackendConfig(
        config.hiera.configFile,
        backend,
        cb
      );
    },

    function (b, cb) {
      if (!b) {
        cb(new Error('Backend ' +  backend + ' not found!'));
        return;
      }

      common.getFileTree(b[':datadir'], cb);
    }
  ], function (err, files) {
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
  var backend = req.params.backend;

  hiera.getFile(config.hiera.configFile, backend, req.params[0], function (err, file) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(file);
  });
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
      return;
    }

    res.send(200);
  });
}
