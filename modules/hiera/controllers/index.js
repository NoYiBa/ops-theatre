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
  hiera.getConfig(config.hiera.configFile, function (err, config) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(config);
  });
}

/**
 * Get hiera hierarchy.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getHierarchy(req, res) {
  hiera.getHierarchy(config.hiera.configFile, function (err, hierarchy) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(hierarchy);
  });
}

/**
 * Persist hiera config file.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function saveConfig(req, res) {
  hiera.saveConfig(config.hiera.configFile, req.body, function (err) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    res.send(200);
  });
}
