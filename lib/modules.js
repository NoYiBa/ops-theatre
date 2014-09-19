'use strict';

var fs, path, async, common;
var modulesDir, _app, _modules, _methods;
var findit;

// manage UI-related data
fs         = require('fs');
path       = require('path');
async      = require('async');
findit     = require('findit');
common     = require('./common');
modulesDir = path.normalize(__dirname + '/../modules');

_app     = null;
_modules = {};
_methods = [ 'get', 'post', 'put', 'del' ];

module.exports = {
  load     : load,
  _modules : _modules
};

// load modules
function load(app, cb) {
  // keep a reference
  _app = app;

  async.waterfall([
    common.getDirectories.bind(common, modulesDir),
    _loadMeta,
    _loadRoutes
  ], function (err, modules) {
    if (err) {
      cb(err);
      return;
    }

    cb(null, modules);
  });
}

// load module metadata files
function _loadMeta(dirs, cb) {
  async.each(dirs, function (dir, cb) {
    var name, meta;

    name = path.basename(dir);
    meta = dir + '/meta.json';

    fs.exists(meta, function (exists) {
      if (!exists) {
        cb(new Error('Meta file missing: ' + meta));
        return;
      }

      meta = require(meta);

      // merge metadata into module cache
      _modules[name] = Object.merge({
        path : dir
      }, meta);

      console.log('Loading module: %s', name);
      cb();
    });
  }, function (err) {
    cb(err, _modules);
  });
}

// load module routes, if any
function _loadRoutes(modules, cb) {
  // TODO: support loading of module dependencies
  Object.each(modules, function (name, module) {
    var routes, prefix;

    routes = module.routes || {};

    // if this is the core module, don't
    // include its name in the final URI
    prefix = name === 'core' ? '' : '/' + name;

    Object.each(routes, function (key, value) {
      var method, route, controller, action;

      key    = key.split(' ');
      method = key[0].toLowerCase();
      route  = key[1];

      // throw an error if its an invalid HTTP verb
      if (_methods.indexOf(method) === -1) {
        throw new Error('Unsupported method: ' + method);
      }

      value      = value.split('.');
      controller = value[0];
      action     = value[1];

      route      = [ prefix, route ].join('').remove(/\/$/);
      controller = require(module.path + '/controllers/' + controller);

      // suport '/' route for
      // core module
      if (!route) {
        route = '/';
      }

      console.log('%s: setting up route for %s', name, route);

      // setup a controller action for a given route
      _app[method](route, controller[action]);
    });
  });

  cb(null, modules);
}
