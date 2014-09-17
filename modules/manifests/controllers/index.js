'use strict';

var fs, common, config;

fs     = require('fs');
common = require('../../../lib/common');
config = require('../../../app.json');

module.exports = {
  getAll : getAll,
  get    : get,
  save   : save
};

function getAll(req, res) {
  common.getFileTree(config.manifestsDir, function (err, files) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(files);
  });
}

function get(req, res) {
  var filename, filepath;

  filename = req.params[0];
  filepath = config.manifestsDir + '/' + filename;

  fs.readFile(filepath, 'utf8', function (err, data) {
    res.send({
      filename : filename,
      data     : data
    });
  });
}

function save(req, res) {
}
