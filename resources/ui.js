'use strict';

require('sugar');

// manage UI-related data
var fs        = require('fs');
var path      = require('path');
var async     = require('async');
var publicDir = path.normalize(__dirname + '/../public');
var hooksDir  = publicDir + '/js/hooks';

module.exports = function UI(app) {
  app.get('/ui/hooks', getAll);
  app.get('/ui/hooks/:hook', get);
};

// retrieve all hooks
function getAll(req, res) {
  async.waterfall([
    fs.readdir.bind(fs, hooksDir),

    function getFileStats(files, cb) {
      async.map(files, function (file, cb) {
        var filename = hooksDir + '/' + file;

        fs.stat(filename, function (err, stats) {
          if (err) {
            cb(err);
            return;
          }

          cb(null, {
            filename : filename,
            stats    : stats
          });
        });
      }, cb);
    },

    function filterDirectories(files, cb) {
      files = files.filter(function (file) {
        return file.stats.isDirectory(); 
      });

      files = files.map(function (file) {
        return file.filename;
      });

      cb(null, files);
    }
  ], function (err, files) {
    if (err) {
      throw err;
    }

    async.map(files, function (file, cb) {
      var type = path.basename(file);

      getHook(type, function (err, modules) {
        if (err) {
          cb(err);
          return;
        }

        cb(err, {
          type    : type,
          modules : modules 
        });
      });
    }, function (err, hooks) {
      if (err) {
        res.status(500);
        res.send(err);
      }

      res.send(hooks);
    });
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

// return all modules for a given hook
function getHook(type, cb) {
  var thisHookDir = hooksDir + '/' + type;

  fs.readdir(thisHookDir, function (err, files) {
    if (err) {
      res.status(500);
      res.send(err);
    }

    files = files.map(function (file) {
        return thisHookDir + '/' + file;
    });

    async.map(files, function (file, cb) {
      fs.stat(file, function (err, stats) {
        if (err) {
          cb(err);
          return;
        }

        cb(null, {
          filename : file,
          stats    : stats
        });
      });
    }, function (err, files) {
      var modules = files.filter(function (file) {
        return file.stats.isDirectory();
      }).map(function (dir) {
        return {
          type : type,
          name : path.basename(dir.filename),
          uri  : dir.filename.remove(publicDir) // remove the publicDir path
        };
      });

      // return collection of modules
      cb(null, modules);
    });
  });
}
