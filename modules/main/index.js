'use strict';

var fs, path, async, common, modules;

fs         = require('fs');
path       = require('path');
async      = require('async');
common     = require('../../lib/common');
modules = require('../../lib/modules');

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
