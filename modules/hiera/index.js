'use strict';

var fs, hiera, config;

fs     = require('fs');
hiera  = require('puppet-hiera');
config = require(__dirname + '/../../app.json');

module.exports = {
  getConfig     : getConfig,
  getHierarchy  : getHierarchy,
  getBackendAll : getBackendAll,
  getBackend    : getBackend,
  getFiles      : getFiles,
  getFile       : getFile,
  saveConfig    : saveConfig,
  saveFile      : saveFile
};

// get the entire hiera configuration
function getConfig(req, res) {
  res.send(hiera.getConfig(config.hiera.configFile));
}

// get hiera hierarchy
function getHierarchy(req, res) {
  res.send(hiera.getHierarchy(config.hiera.configFile));
}

// get all hiera backends
function getBackendAll(req, res) {
  res.send(hiera.getBackends(config.hiera.configFile));
}

// get configuration for a specific hiera backend
function getBackend(req, res) {
  var backend = req.params.backend;
  res.send(hiera.getBackendConfig(config.hiera.configFile, backend));
}

// get a list of Hiera files
function getFiles(req, res) {
  var backend = req.params.backend;

  hiera.getFiles(config.hiera.configFile, backend, function (err, files) {
    res.send(files);
  });
}

// get contents of a Hiera file for a specified backend
function getFile(req, res) {
  var backend, file;

  backend = req.params.backend;
  file    = hiera.getFile(config.hiera.configFile, backend, req.params[0]);

  res.send(file);
}

// persist hiera config file
function saveConfig(req, res) {
  var ret = hiera.saveConfig(config.hiera.configFile, req.body);
  res.send(200);
}

// savve contents to a Hiera file for a specified backend
function saveFile(req, res) {
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
