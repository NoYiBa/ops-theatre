'use strict';

var fs, path, async, loopback, common;
var modulesDir, _app, _modules, _methods;

// manage UI-related data
fs         = require('fs');
path       = require('path');
async      = require('async');
loopback   = require('loopback');
common     = require('./common');
modulesDir = path.normalize(__dirname + '/../modules');

_app     = null;
_modules = {};
_methods = [ 'get', 'post', 'put', 'del' ];

module.exports = {
  load    : load,
  mountUI : mountUI
};

// load modules
function load(app, cb) {
  // keep a reference
  _app = app;

  async.waterfall([
    fs.readdir.bind(fs, modulesDir),
    common.setFilepaths.bind(common, modulesDir),
    common.getDirectories.bind(common),
    _loadMeta,
    _loadRoutes
  ], function (err, modules) {
    if (err) {
      cb(err);
      return;
    }

    cb();
  });
}

// load module metadata files
function _loadMeta(dirs, cb) {
  dirs.each(function (dir) {
    var name, meta;

    name = path.basename(dir);
    meta = dir + '/meta.json';

    fs.exists(meta, function (exists) {
      if (exists) {
        meta = require(meta);

        // merge metadata into module cache
        _modules[name] = Object.merge({
          path : dir
        }, meta);

        console.log('Loading module: %s', name);
      }
    });
  });

  cb(null, _modules);
}

// load module routes, if any
function _loadRoutes(modules, cb) {
  // TODO: support loading of module dependencies
  Object.each(modules, function (name, module) {
    var routes, prefix;

    routes = module.routes || {};

    // if this is the common module, don't
    // include its name in the final URI
    prefix = name === 'common' ? '' : '/' + name;

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
      controller = require(module.path + '/' + controller);

      console.log('%s: setting up route for %s', name, route);

      // setup a controller action for a given route
      _app[method](route, controller[action]);
    });
  });

  cb(null, modules);
}

// mount module UIs
function mountUI(cb) {
  var modules = [];

  Object.each(_modules, function (name, module) {
    modules.push({
      name   : name,
      uiPath : module.path + '/ui'
    });
  });

  async.filter(modules, function (module, cb) {
    fs.exists(module.uiPath, cb);
  }, function (modules) {
    modules.each(function (module) {
      var name, uiPath;

      name   = module.name;
      uiPath = module.uiPath;

      _app.use('/js/modules/' + name, loopback.static(uiPath));
      console.log('%s: mounting UI', name);
    });

    cb();
  });
}
