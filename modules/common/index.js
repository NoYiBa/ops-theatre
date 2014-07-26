'use strict';

var fs, path, async, common, publicDir, hooksDir;

fs        = require('fs');
path      = require('path');
async     = require('async');
common    = require('../../lib/common');
publicDir = path.normalize(__dirname + '/../../public');
hooksDir  = publicDir + '/js/hooks';

module.exports = {
  getAll      : getAll,
  get         : get,
  getAllHooks : getAllHooks,
  getHook     : getHook
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

// retrieve all hooks
function getAllHooks(req, res) {
  async.waterfall([
    fs.readdir.bind(fs, hooksDir),
    common.setFilepaths.bind(common, hooksDir),
    common.getDirectories.bind(common),

    function getHooks(dirs, cb) {
      async.map(dirs, function (dir, cb) {
        var type = path.basename(dir);
        getHook(type, cb);
      }, cb);
    }
  ], function (err, hooks) {
    if (err) {
      res.status(500);
      res.send(err);
    }

    res.send(hooks);
  });
}

function get(req, res) {
  var hook = req.params.hook;

  getHook(hook, function (err, modules) {
    if (err) {
      res.status(500);
      res.send(err);
    }

    res.send(modules);
  });
}

// return all hooks for a given type
function getHook(type, cb) {
  var thisHookDir = hooksDir + '/' + type;

  async.waterfall([
    fs.readdir.bind(fs, thisHookDir),
    common.setFilepaths.bind(common, thisHookDir),
    common.getDirectories.bind(common),

    function (dirs, cb) {
      var hooks = dirs.map(function (dir) {
        return {
          type : type,
          name : path.basename(dir),
          uri  : dir.remove(publicDir) // remove the publicDir path
        };
      });

      // return collection of hooks
      cb(null, hooks);
    }
  ], cb);
}
