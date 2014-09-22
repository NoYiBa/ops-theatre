/**
 * OpsTheatre API server.
 *
 * @module app
 * @author rajkissu <rajkissu@gmail.com>
 */
'use strict';

// needed for some in-house modules and libraries
require('sugar');

var http, express, modules, config, app;

http    = require('http');
express = require('express');
modules = require('./lib/modules');
config  = require('./config.json');
app     = express();

// support express-compatible middleware
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser(config.cookieSecret));
app.use(express.session({ secret: config.sessionSecret }));
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// enable cross-domain scripting
// TODO: secure this with a whitelist of referrers?
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");

  next();
});

// enable routing
app.use(app.router);
app.use(express.errorHandler());

//Setup request handlers.
// load modules
modules.load(app, function (err) {
  if (err) {
    // TODO: handle this error
    throw err;
  }

  // Optionally start the server
  // (only if this module is the main module)
  if(require.main === module) {
    http.createServer(app).listen(config.port, config.host, function(){
      var baseUrl = [
        'http://', config.host, ':', config.port
      ].join('');

      console.log('OpsTheatre API server listening @ %s%s', baseUrl, '/');
    });
  }
});
