'use strict';

module.exports = {
  get    : get,
  login  : login,
  logout : logout
};

var _identity = null;

function get(req, res) {
  res.send(_identity);
}

function login(req, res) {
  var body, username, email;

  body     = req.body;
  username = body.email.split('@')[0];
  email    = body.email;

  _identity = {
    username : username,
    email    : body.email
  };

  res.send(200);
}

function logout(req, res) {
  _identity = null;

  res.send(200);
}
