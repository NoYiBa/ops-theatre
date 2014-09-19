'use strict';

var hiera, config;

hiera  = require('puppet-hiera');
config = require('../../../config.json');

module.exports = {
  getConfig     : getConfig,
  getHierarchy  : getHierarchy,
  saveConfig    : saveConfig,
};

// get the entire hiera configuration
function getConfig(req, res) {
  res.send(hiera.getConfig(config.hiera.configFile));
}

// get hiera hierarchy
function getHierarchy(req, res) {
  res.send(hiera.getHierarchy(config.hiera.configFile));
}

// persist hiera config file
function saveConfig(req, res) {
  var ret = hiera.saveConfig(config.hiera.configFile, req.body);
  res.send(200);
}
