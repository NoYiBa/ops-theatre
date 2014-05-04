var exec = require('child_process').exec;

var getFact = function(factName, callback, options) {
  var options = options || {};

  if (factName == 'all') {
    factName = '';
  }

  exec('facter -j ' + factName, function(err, stdout, stderr){
    if (err) return callback(err);

    // if we need to only return names, parse the output
    if (options['namesOnly']) {
      callback(null, Object.keys(JSON.parse(stdout)));
    } else {
      // otherwise, just return it as JSON
      callback(null, JSON.parse(stdout));
    };
  });

}

exports.getFacts = function(namesOnly, callback) {

  options = { 'namesOnly': namesOnly };

  getFact('all', callback, options );  

}

exports.getFact = getFact;
