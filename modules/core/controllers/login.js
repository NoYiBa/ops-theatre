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
  _identity = {
    username : 'rajkissu',
    email    : 'rajkissu@gmail.com'
  };

  res.send(200);
}

function logout(req, res) {
  _identity = null;

  res.send(200);
}
