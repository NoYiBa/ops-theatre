'use strict';

var modules, _start;

require('sugar');

modules = require('../../../lib/modules');

module.exports = {
  uptime : uptime,
  getAll : getAll,
  get    : get
};

// start time
_start = Date.create();

function uptime(req, res) {
  var uptime = Date.create() - _start;

  res.send({
    start  : _start.toISOString(),
    uptime : (uptime / 1000) + ' seconds'
  });
}

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
