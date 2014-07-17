'use strict';

// API resource helper functions
require('sugar');

var fs = require('fs');
var async = require('async');
var resourcesDir = __dirname + '/../resources';

exports.autoload = autoload;

// auto-load resources
function autoload(app, cb) {
  async.waterfall([
    function (cb) {
    fs.readdir(resourcesDir, cb);
  },

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
