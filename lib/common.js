'use strict';

var fs, path, async, findit;

require('sugar');

fs     = require('fs');
path   = require('path');
async  = require('async');
findit = require('findit');

module.exports = {
  setFilepaths   : setFilepaths,
  getDirectories : getDirectories,
  getFileTree    : getFileTree
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

function getFileTree(rootDir, cb) {
  var finder, dirs, files;

  cb     = Object.isFunction(cb) ? cb : function () {};
  finder = findit(rootDir);
  dirs   = [];
  files  = [];

  finder.on('directory', function (dir, stat, stop) {
    var base = path.basename(dir);

    // ignore special directories
    if (base === '.git' || base === 'node_modules') {
      stop();
    }

    // don't include the root directory
    if (dir !== rootDir) {
      dirs.push(dir.remove(rootDir + '/'));
    }
  });

  finder.on('file', function (file, stat) {
    var base = path.basename(file);

    if (base[0] !== '.') {
      files.push(file.remove(rootDir + '/'));
    }
  });

  finder.on('end', function () {
    var final = [];

    dirs.each(function (dir) {
      _treeSort(final, dir);
    });

    files.each(function (file) {
      _treeSort(final, file);
    });

    cb(null, final);
  });

  finder.on('error', function (err) {
    cb(err);
  });
}

function _treeSort(tree, file) {
  var base, placed;

  base   = path.basename(file);
  placed = false;

  tree.each(function (value, key) {
    var id, children;

    if (Object.isString(value)) {
      return true;
    }

    id       = value.id;
    children = value.children;

    if (file.has(id)) {
      _treeSort(children, file);

      placed = true;
      return false;
    }
  });

  if (!placed) {
    tree.push({
      id       : file,
      label    : base,
      children : []
    });
  }
}
