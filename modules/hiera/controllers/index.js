/**
 * Hiera index controller.
 *
 * @module hiera/controllers/index
 * @author rajkissu <rajkissu@gmail.com>
 */
/* jslint node: true */
"use strict";

var hiera, config;

hiera  = require('puppet-hiera');
config = require('../../../config.json');

module.exports = {
  getConfig     : getConfig,
  getHierarchy  : getHierarchy,
  saveConfig    : saveConfig,
};

/**
 * Get the entire hiera configuration.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getConfig(req, res) {
  res.send(hiera.getConfig(config.hiera.configFile));
}

/**
 * Get hiera hierarchy.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getHierarchy(req, res) {
  res.send(hiera.getHierarchy(config.hiera.configFile));
}

/**
 * Persist hiera config file.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function saveConfig(req, res) {
  var ret = hiera.saveConfig(config.hiera.configFile, req.body);
  res.send(200);
}
