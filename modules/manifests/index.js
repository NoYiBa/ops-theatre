'use strict';

var fs, config;

fs     = require('fs');
config = require(__dirname + '/../../app.json');

module.exports = {
  get : get
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
