'use strict';

var fs = require('fs');
var config = require(__dirname + '/../app.json');

module.exports = function Manifest(app) {
  app.get('/manifests/:filename', get);
};

function get(req, res) {
  var filename = req.params.filename;

  fs.readFile(config.manifestsDir + '/' + filename, 'utf8', function (err, data) {
    res.send({
      filename : filename,
      data     : data
    });
  });
}
