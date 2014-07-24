'use strict';

var fs, path, async, common, publicDir, hooksDir;

// manage UI-related data
fs        = require('fs');
path      = require('path');
async     = require('async');
common    = require('../lib/common');
publicDir = path.normalize(__dirname + '/../public');
hooksDir  = publicDir + '/js/hooks';

module.exports = function UI(app) {
  app.get('/hooks', getAll);
  app.get('/hooks/:hook', get);
};

// retrieve all hooks
function getAll(req, res) {
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
