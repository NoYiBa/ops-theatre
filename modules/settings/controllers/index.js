'use strict';

var fs, path, async, common, modules;

fs      = require('fs');
path    = require('path');
async   = require('async');
common  = require('../../../lib/common');
modules = require('../../../lib/modules');

module.exports = {
  getAll : getAll,
  get    : get
};

// retrieve all module settings
// TODO: cache settings
function getAll(req, res) {
  var tasks = {};

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

    res.send(settings);
  });
}

function get(req, res) {
  var name = req.params.module;

  getSettings(name, function (err, module) {
    res.send(module);
  });
}

// get settings for a given module
function getSettings(name, cb) {
  var module, filepath;
  
  module   = modules._modules[name];
  filepath = module.path + '/settings.json';

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
