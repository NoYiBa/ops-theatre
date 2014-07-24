'use strict';

var fs, path, async, common, publicDir, modulesDir;

// manage UI-related data
fs         = require('fs');
path       = require('path');
async      = require('async');
common     = require('../lib/common');
publicDir  = path.normalize(__dirname + '/../public');
modulesDir = publicDir + '/js/modules';

module.exports = function UI(app) {
  app.get('/modules', getAll);
  app.get('/modules/:module', get);
};

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
