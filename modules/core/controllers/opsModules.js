'use strict';

var modules = require('../../../lib/modules');

module.exports = {
  getAll : getAll,
  get    : get
};

// retrieve all modules
function getAll(req, res) {
  var m = modules._modules;
  res.send(m);
}

function get(req, res) {
  var name, mods;

  name = req.params.module;
  m    = modules._modules[name];

  if (m) {
    res.send(m);
  } else {
    res.send(404);
  }
}
