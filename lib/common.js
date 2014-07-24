'use strict';

var fs, async;

fs    = require('fs');
async = require('async');

module.exports = {
  setFilepaths   : setFilepaths,
  getDirectories : getDirectories
};

function setFilepaths(path, files, cb) {
  async.map(files, function (file, cb) {
    cb(null, path + '/' + file);
  }, cb);
}

function getDirectories(paths, cb) {
  // so it works with async waterfall()
  cb = cb.bind(cb, null);

  async.filter(paths, function (path, cb) {
    fs.stat(path, function (err, stats) {
      cb(stats ? stats.isDirectory() : false);
    });
  }, cb);
}
