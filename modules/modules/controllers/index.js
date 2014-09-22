/**
 * Modules index controller.
 *
 * @module modules/controllers/index
 * @author rajkissu <rajkissu@gmail.com>
 */
'use strict';

var fs, common, config;

fs     = require('fs');
common = require('../../../lib/common');
config = require('../../../config.json');

module.exports = {
  getAll : getAll,
  get    : get,
  save   : save
};

/**
 * Get tree listings for all Puppet modules.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getAll(req, res) {
  common.getFileTree(config.modules.dir, [
    /^lib$/,
    /^spec$/,
    /^puppet$/,
    /^concat$/,
    /^stdlib$/
  ], function (err, files) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(files);
  });
}

/**
 * Get contents of a Puppet module file.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function get(req, res) {
  var filename, filepath;

  filename = req.params[0];
  filepath = config.modules.dir + '/' + filename;

  fs.readFile(filepath, 'utf8', function (err, data) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(data);
  });
}

/**
 * Save changes to a Puppet module file.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function save(req, res) {
  var filename, filepath, data;

  filename = req.params[0];
  filepath = config.modules.dir + '/' + filename;
  data     = req.body.data;

  fs.writeFile(filepath, data, 'utf8', function (err) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(200);
  });
}
