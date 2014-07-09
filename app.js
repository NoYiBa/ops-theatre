var loopback = require('loopback');
var path = require('path');
var fs = require('fs');
var app = module.exports = loopback();
var started = new Date();
var puppetHiera = require('puppet-hiera');
var puppetFacter = require('puppet-facter');
var puppetDB = require('puppet-puppetdb');
var config = require('./app.json');

/*
 * 1. Configure LoopBack models and datasources
 *
 * Read more at http://apidocs.strongloop.com/loopback#appbootoptions
 */

app.boot(__dirname);

/*
 * 2. Configure request preprocessing
 *
 *  LoopBack support all express-compatible middleware.
 */

app.use(loopback.favicon());
app.use(loopback.logger(app.get('env') === 'development' ? 'dev' : 'default'));
app.use(loopback.cookieParser(app.get('cookieSecret')));
app.use(loopback.token({model: app.models.accessToken}));
app.use(loopback.bodyParser());
app.use(loopback.methodOverride());

/*
 * EXTENSION POINT
 * Add your custom request-preprocessing middleware here.
 * Example:
 *   app.use(loopback.limit('5.5mb'))
 */

/*
 * 3. Setup request handlers.
 */

// LoopBack REST interface
app.use(app.get('restApiRoot'), loopback.rest());

// API explorer (if present)
try {
  var explorer = require('loopback-explorer')(app);
  app.use('/explorer', explorer);
  app.once('started', function(baseUrl) {
    console.log('Browse your REST API at %s%s', baseUrl, explorer.route);
  });
} catch(e){
  console.log(
    'Run `npm install loopback-explorer` to enable the LoopBack explorer'
  );
}

/*
 * EXTENSION POINT
 * Add your custom request-handling middleware here.
 * Example:
 *   app.use(function(req, resp, next) {
 *     if (req.url == '/status') {
 *       // send status response
 *     } else {
 *       next();
 *     }
 *   });
 */

// Let express routes handle requests that were not handled
// by any of the middleware registered above.
// This way LoopBack REST and API Explorer take precedence over
// express routes.
app.use(app.router);

// The static file server should come after all other routes
// Every request that goes through the static middleware hits
// the file system to check if a file exists.
app.use(loopback.static(path.join(__dirname, 'public')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

/*
 * 4. Setup error handling strategy
 */

/*
 * EXTENSION POINT
 * Add your custom error reporting middleware here
 * Example:
 *   app.use(function(err, req, resp, next) {
 *     console.log(req.url, ' failed: ', err.stack);
 *     next(err);
 *   });
 */

// The ultimate error handler.
app.use(loopback.errorHandler());


/*
 * 5. Add a basic application status route at the root `/`.
 *
 * (remove this to handle `/` on your own)
 */

app.get('/', loopback.status());

// Get all hiera hierarchies
app.get('/hiera/hierarchies', function (req, res) {
  res.send(puppetHiera.getHieraHierarchies(config.hiera.configfile));
});

// Get all hiera backends
app.get('/hiera/backends', function (req, res) {
  res.send(puppetHiera.getHieraBackends(config.hiera.configfile));
});

// get the configuration for a specific hiera backend
app.get('/hiera/backendconfig/:backend', function (req, res) {
  var backend = req.params.backend;
  res.send(puppetHiera.getHieraBackendConfig(config.hiera.configfile, backend));
});

// Get all facts from the server. Set :names to 'names' in order to retrieve
// just fact names without values
app.get('/facter', function (req, res, next){
    puppetFacter.getFacts(false, function (err, data) {
      res.send(data);
    });
});

// Get a specific fact from facter.
app.get('/facter/:fact', function (req, res, next){
  var fact = req.params.fact;

  puppetFacter.getFact(fact, function (err, data) {
    res.send(data);
  });
});

// Get a list of nodes known to puppetdb
app.get('/puppetdb/nodes', function (req, res) {
  puppetDB.getAllNodes(config.puppetdb, function (error, data) {
      res.send(data);
    });
});

// Get a list of all fact names known to puppetdb
app.get('/puppetdb/fact-names', function (req, res) {
  puppetDB.getAllFactNames(config.puppetdb, function (error, data) {
      res.send(data);
    });
});

// Get the last stored facts for a node known to puppetdb
app.get('/puppetdb/nodes/:node/facts', function (req, res) {
  var node = req.params.node;
  puppetDB.getNodeFacts(config.puppetdb, node, function (error, data) {
      res.send(data);
    });
});

// Get all values for a specific fact known to puppetdb
app.get('/puppetdb/facts/:fact', function (req, res) {
  var fact = req.params.fact;
  puppetDB.getAllFactValues(config.puppetdb, fact, function (error, data) {
      res.send(data);
    });
});

app.get('/manifests/:filename', function (req, res) {
    var filename = req.params.filename;

    fs.readFile(config.manifestsdir + '/' + filename, 'utf8', function (err, data) {
        res.send({
            filename : filename,
            data     : data
        });
    });
});

/*
 * 6. Enable access control and token based authentication.
 */

var swaggerRemote = app.remotes().exports.swagger;
if (swaggerRemote) swaggerRemote.requireToken = false;

app.enableAuth();

/*
 * 7. Optionally start the server
 *
 * (only if this module is the main module)
 */

app.start = function() {
  return app.listen(function() {
    var baseUrl = 'http://' + app.get('host') + ':' + app.get('port');
    app.emit('started', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
  });
};

if(require.main === module) {
  app.start();
}
