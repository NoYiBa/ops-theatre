'use strict';

var fs, hiera, config;

fs     = require('fs');
hiera  = require('puppet-hiera');
config = require(__dirname + '/../../app.json');

module.exports = {
  getHiera      : getHiera,
  getHierarchy  : getHierarchy,
  getBackendAll : getBackendAll,
  getBackend    : getBackend,
  getFiles      : getFiles,
  getFile       : getFile,
  saveHiera     : saveHiera
};

// get the entire hiera configuration
function getHiera(req, res) {
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
  var backend, files;

  backend = req.params.backend;
  files   = hiera.getFiles(config.hiera.configFile, backend);

  res.send(files);
}

// get contents of a Hiera file for a specified backend
function getFile(req, res) {
  var backend, file;

  backend = req.params.backend;
  file    = hiera.getFile(config.hiera.configFile, backend, req.params[0]);

  res.send(file);
}

// persist hiera config file
function saveHiera(req, res) {
  var ret = hiera.saveConfig(config.hiera.configFile, req.body);
  res.send(200);
}
