'use strict';

var facter = require('puppet-facter');

module.exports = {
  getAll : getAll,
  get    : get,
};

// Get all facts from the server
function getAll(req, res) {
  facter.getFacts(false, function (err, data) {
    res.send(data);
  });
}

// Get a specific fact from facter
function get(req, res) {
  var fact = req.params.fact;

  facter.getFact(fact, function (err, data) {
    res.send(data);
  });
}