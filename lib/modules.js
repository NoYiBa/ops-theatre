'use strict';

var fs, path, async, common, publicDir, modulesDir;

// manage UI-related data
fs         = require('fs');
path       = require('path');
async      = require('async');
common     = require('./common');
publicDir  = path.normalize(__dirname + '/../public');
modulesDir = publicDir + '/js/modules';

module.exports = function (app) {
  app.get('/modules', getAll);
  app.get('/modules/:module', get);
};

exports.autoload = autoload;

// auto-load resources
function autoload(app, cb) {
  async.waterfall([
    fs.readdir.bind(fs, resourcesDir),

    function (files, cb) {
      files = files.filter(function (file) {
        return file.has(/\.js$/);
      });

      cb(null, files);
    },

    function (files, cb) {
      var resources = files.map(function (file) {
        var f = require(resourcesDir + '/' + file);

        return (Object.isFunction(f)) ? f : null;
      });

      cb(null, resources.compact());
    }
  ], function (err, resources) {
    if (err) {
      cb(err);
      return;
    }

    // inject resource URI handling
    resources.each(function (resource) {
      resource(app);
    });

    cb(null);
  });
}

// retrieve all modules
function getAll(req, res) {
  async.waterfall([
    fs.readdir.bind(fs, modulesDir),
    common.setFilepaths.bind(common, modulesDir),
    common.getDirectories.bind(common),

    function getModules(dirs, cb) {
      async.map(dirs, function getModules(dir, cb) {
        var name = path.basename(dir);

        getModule(name, cb);
      }, cb);
    }
  ], function (err, modules) {
    if (err) {
      res.status(500);
      res.send(err);
    }

    res.send(modules);
  });
}

function get(req, res) {
  var name = req.params.module;

  getModule(name, function (err, module) {
    if (err) {
      res.status(500);
      res.send(err);
    }

    res.send(module);
  });
}

// return all modules
function getModule(name, cb) {
  var thisModuleDir = modulesDir + '/' + name;

  async.waterfall([
    fs.readdir.bind(fs, thisModuleDir),
    common.setFilepaths.bind(common, thisModuleDir),
    common.getDirectories.bind(common),

    function (dirs, cb) {
      dirs = dirs.map(function (dir) {
        return {
          name : path.basename(dir),
          uri  : dir.remove(publicDir) // remove the publicDir path
        };
      });

      // return collection of directories
      cb(null, dirs);
    }
  ], cb);
}
