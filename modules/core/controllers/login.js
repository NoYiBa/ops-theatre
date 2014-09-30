/**
 * Core login controller.
 *
 * @module core/controllers/login
 * @author rajkissu <rajkissu@gmail.com>
 */
/* jslint node: true */
"use strict";

module.exports = {
  get    : get,
  login  : login,
  logout : logout
};

var _identity = null;

/**
 * Retrieves the login identity.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function get(req, res) {
  res.send(_identity);
}

/**
 * Manages a login attempt.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 *
 * @todo secure the login process.
 */
function login(req, res) {
  var body, username, email;

  body     = req.body;
  username = body.email.split('@')[0];
  email    = body.email;

  // accept any identity for now
  _identity = {
    username : username,
    email    : body.email
  };

  res.send(200);
}

/**
 * Does a logout, clearing the current session.
 *
 * @param {Object} req - express request object.
 * @param {Object} res - express response object.
 */
function logout(req, res) {
  _identity = null;

  res.send(200);
}
