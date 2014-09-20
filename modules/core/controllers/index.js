'use strict';

var _start;

require('sugar');

module.exports = {
  uptime : uptime
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
