'use strict';

var hiera, common, config;

hiera  = require('puppet-hiera');
common = require('../../../lib/common');
config = require('../../../config.json');

module.exports = {
  getAll : getAll,
  get    : get,
  save   : save
};

// get a list of Hiera files
function getAll(req, res) {
  var backend = hiera.getBackendConfig(
    config.hiera.configFile,
    req.params.backend
  );

  common.getFileTree(backend[':datadir'], function (err, files) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(files);
  });
}

// get contents of a Hiera file for a specified backend
function get(req, res) {
  var backend, file;

  backend = req.params.backend;
  file    = hiera.getFile(config.hiera.configFile, backend, req.params[0]);

  res.send(file);
}

// save contents to a Hiera file for a specified backend
function save(req, res) {
  var backend, data;

  backend = req.params.backend;
  data    = req.body.data;

  hiera.saveFile(config.hiera.configFile, backend, req.params[0], data, function (err) {
    if (err) {
      // TODO: send error code
      throw err;
    }

    res.send(200);
  });
}
