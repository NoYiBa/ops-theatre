/**
 * OpsTheatre common library.
 *
 * NOTE: there is a bug with findit which triggers
 * multiple `end` events
 *
 * Temporary workaround: use the once() method
 * to handle the `end` event
 *
 * @module lib/common
 * @author rajkissu <rajkissu@gmail.com>
 *
 * @todo turn this into an stdlid module?
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

/**
 * Retrieves directory listing.
 *
 * @param {string} rootDir - directory to get listings for.
 * @param {Function} cb - function to run when list is ready.
 */
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
    // send directory listing when traversing ends
    cb(null, dirs);
  });

  finder.on('error', function (err) {
    cb(err);
  });
}

/**
 * Retrieves tree listing of directories and files.
 *
 * @param {string} rootDir - directory to get listings for.
 * @param {Function} cb - function to run when list is ready.
 */
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

    // don't include the root directory
    if (base[0] !== '.') {
      files.push(file.remove(rootDir + '/'));
    }
  });

  finder.once('end', function () {
    var tree = [];

    // enter the directories into the tree
    dirs.each(function (dir) {
      _treeSort(tree, dir);
    });

    // enter the files into the tree
    files.each(function (file) {
      _treeSort(tree, file);
    });

    cb(null, tree);
  });

  finder.on('error', function (err) {
    cb(err);
  });
}

/**
 * Enters a node into the tree, sorting it at
 * the same time.
 *
 * @private
 *
 * @param {Array} tree - collection of nodes.
 * @param {string} node - node to insert into the tree.
 */
function _treeSort(tree, node) {
  var base, placed;

  base   = path.basename(node);
  placed = false;

  tree.each(function (value, key) {
    var id, children;

    if (Object.isString(value)) {
      return true;
    }

    id       = value.id;
    children = value.children;

    if (node.has(id)) {
      _treeSort(children, node);

      placed = true;
      return false;
    }
  });

  if (!placed) {
    tree.push({
      id       : node,
      label    : base,
      children : []
    });
  }
}
