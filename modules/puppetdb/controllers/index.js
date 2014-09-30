/**
 * PuppetDB index controller.
 *
 * @module puppetdb/controllers/index
 * @author rajkissu <rajkissu@gmail.com>
 */
/* jslint node: true */
"use strict";

var puppetDB = require('puppet-puppetdb');

module.exports = {
  getNodes     : getNodes,
  getFactNames : getFactNames,
  getNodeFacts : getNodeFacts,
  getFact      : getFact
};

/**
 * Get a list of nodes known to puppetdb.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getNodes(req, res) {
  puppetDB.getAllNodes(config.puppetdb, function (error, data) {
    res.send(data);
  });
}

/**
 * Get a list of all fact names known to puppetdb.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getFactNames(req, res) {
  puppetDB.getAllFactNames(config.puppetdb, function (error, data) {
    res.send(data);
  });
}

/**
 * Get the last stored facts for a node known to puppetdb.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getNodeFacts(req, res) {
  var node = req.params.node;

  puppetDB.getNodeFacts(config.puppetdb, node, function (error, data) {
    res.send(data);
  });
}

/**
 * Get all values for a specific fact known to puppetdb.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getFact(req, res) {
  var fact = req.params.fact;

  puppetDB.getAllFactValues(config.puppetdb, fact, function (error, data) {
    res.send(data);
  });
}
