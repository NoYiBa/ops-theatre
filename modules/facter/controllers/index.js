/**
 * Facter index controller.
 *
 * @module controllers/index
 * @author rajkissu <rajkissu@gmail.com>
 */
/* jslint node: true */
"use strict";

var facter = require('puppet-facter');

module.exports = {
  getAll : getAll,
  get    : get,
};

/**
 * Get all facts from the server.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function getAll(req, res) {
  facter.getFacts(false, function (err, data) {
    res.send(data);
  });
}

/**
 * Get a specific fact.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function get(req, res) {
  var fact = req.params.fact;

  facter.getFact(fact, function (err, data) {
    res.send(data);
  });
}
