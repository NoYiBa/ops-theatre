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

/* jslint node: true */
"use strict";

var path, findit, _cache;

require('sugar');

path   = require('path');
findit = require('findit');

_cache = {
  directories : {},
  filetrees   : {}
};

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

  cb = Object.isFunction(cb) ? cb : function () {};

  /*
  if (dirs = _cache.directories[rootDir]) {
    // return cached copy
    cb(null, dirs);
    return;
  }
  */

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
    // cache the listing
    _cache.directories[rootDir] = dirs;

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
 * @param {Array} [ignoreList] - a list of file patterns to ignore.
 * @param {Function} cb - function to run when list is ready.
 */
function getFileTree(rootDir, ignoreList, cb) {
  var finder, dirs, files;

  // if there's no 3rd argument, ignoreList might contain
  // the callback function
  if (!cb) {
    cb = ignoreList;
    ignoreList = [];
  }

  cb = Object.isFunction(cb) ? cb : function () {};

  /*
  if (dirs = _cache.filetrees[rootDir]) {
    // return cached copy
    cb(null, dirs);
    return;
  }
  */

  finder = findit(rootDir);
  dirs   = [];
  files  = [];

  ignoreList.unshift(/^\./);

  console.log('@ignoreList', ignoreList);

  finder.on('directory', function (dir, stat, stop) {
    var base = path.basename(dir);

    // ignore special directories
    if (base === '.git' || base === 'node_modules') {
      stop();
      return;
    }

    if (_ignore(base, ignoreList)) {
      stop();
      return;
    }

    // don't include the root directory
    if (dir !== rootDir && !_ignore(dir, ignoreList)) {
      dirs.push(dir.remove(rootDir + '/'));
    }
  });

  finder.on('file', function (file, stat) {
    var base = path.basename(file);

    if (_ignore(base, ignoreList)) {
      return;
    }

    files.push(file.remove(rootDir + '/'));
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

    // cache the filetree
    _cache.filetrees[rootDir] = tree;

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

/**
 * Determines if a string should be ignored.
 *
 * @param {string} str - the string to check.
 * @param {Array} list - a collection of patterns to ignore.
 * @returns {Boolean} true if the string matches any of the list patterns.
 */
function _ignore(str, list) {
  var ignore = false;

  console.log('_ignore', str, list);

  list.each(function (item) {
    if (str.match(item)) {
      ignore = true;
      return ignore;
    }
  });

  return ignore;
}
