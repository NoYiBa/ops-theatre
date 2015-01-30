/**
 * Core login controller.
 *
 * @module core/controllers/login
 * @author rajkissu <rajkissu@gmail.com>
 */
/* jslint node: true */
"use strict";

var crypto = require('crypto');

module.exports = {
  get    : get,
  login  : login,
  logout : logout
};

var _identity = null;

// TODO: offload this to the database
var _allowedUsers = [
  { email : 'walterheck@olindata.com', password : 'b7809b29b74213e6b6b6ab598fa104da' },
  { email : 'raj@olindata.com', password : '673a2a9b802628811be52704bc3b05e9' }
];

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
  var body, username, email, password, md5sum;

  body     = req.body;
  username = body.email.split('@')[0];
  email    = body.email;
  password = body.password;

  // hash the password
  md5sum = crypto.createHash('md5');
  md5sum.update(password);

  password = md5sum.digest('hex');

  // find a valid user
  _identity = _allowedUsers.find({
    email    : email,
    password : password
  });

  if (_identity) {
    // valid user found, don't send the password!
    _identity = {
      username : username,
      email    : email
    };

    res.send(200);
    return;
  }

  // no valid user found
  res.send(403);
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
