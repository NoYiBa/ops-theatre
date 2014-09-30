/**
 * Core settings controller.
 *
 * @module core/controllers/settings
 * @author rajkissu <rajkissu@gmail.com>
 */
/* jslint node: true */
"use strict";

var fs, path, async, common, modules, _settings;

fs      = require('fs');
path    = require('path');
async   = require('async');
common  = require('../../../lib/common');
modules = require('../../../lib/modules');

module.exports = {
  getAll : getAll,
  get    : get
};

_settings = null;

/**
 * Retrieves all OpsTheatre module settings.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
*/
function getAll(req, res) {
  var tasks = {};

  // return a cached copy if it exists
  if (Object.isObject(_settings)) {
    res.send(_settings);
    return;
  }

  // setup tasks to retrieve individual module settings
  Object.each(modules._modules, function (name, module) {
    tasks[name] = function (cb) {
      getSettings(name, cb);
    };
  });

  async.parallel(tasks, function (err, settings) {
    if (err) {
      res.status(500);
      res.send(err);
    }

    // remove modules with no settings
    settings = Object.findAll(settings, function (name, value, settings) {
      if (Object.size(value) !== 0) {
        return value;
      }
    });

    // cache the settings
    _settings = settings;

    res.send(settings);
  });
}

/**
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function get(req, res) {
  var name = req.params.module;

  getSettings(name, function (err, module) {
    res.send(module);
  });
}

/**
 * Retrieves settings for a specific OpsTheatre module.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getSettings(name, cb) {
  var module, filepath;
  
  module   = modules._modules[name];
  filepath = module.path + '/settings.json';

  // check if the module has a settings file
  fs.exists(filepath, function (exists) {
    var settings;

    if (!exists) {
      cb(null, {});
      return;
    }

    settings = require(filepath);
    cb(null, settings);
  });
}
