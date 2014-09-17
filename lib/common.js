/*
 * NOTE: there is a bug with findit which triggers
 * multiple `end` events
 *
 * Temporary workaround: use the once() method
 * to handle the `end` event
 *
 * TODO: turn this into an stdlid module?
 */
'use strict';

var path, findit;

require('sugar');

path   = require('path');
findit = require('findit');

module.exports = {
  getDirectories : getDirectories,
  getFileTree    : getFileTree
};

function getDirectories(rootDir, cb) {
  var finder, dirs;

  cb     = Object.isFunction(cb) ? cb : function () {};
  finder = findit(rootDir);
  dirs   = [];

  finder.on('directory', function (dir, stat, stop) {
    var dirname = path.dirname(dir);

    // walk to 1-depth in the modules directory
    if (dirname === rootDir) {
      stop();
    }

    // don't include the modules directory
    if (dir !== rootDir) {
      dirs.push(dir);
    }
  });

  finder.once('end', function () {
    cb(null, dirs);
  });

  finder.on('error', function (err) {
    cb(err);
  });
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

  finder.once('end', function () {
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
