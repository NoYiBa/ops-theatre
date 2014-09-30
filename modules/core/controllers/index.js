/**
 * Core index controller.
 *
 * @module core/controllers/index
 * @author rajkissu <rajkissu@gmail.com>
 */
/* jslint node: true */
"use strict";

var _start;

require('sugar');

module.exports = {
  uptime : uptime
};

// store the time the controller is first loaded
_start = Date.create();

/**
 * Provides server uptime.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function uptime(req, res) {
  var uptime = Date.create() - _start;

  // send uptime in seconds
  res.send({
    start  : _start.toISOString(),
    uptime : (uptime / 1000) + ' seconds'
  });
}
