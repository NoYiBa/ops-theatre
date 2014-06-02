var yaml, fs;

yaml = require('js-yaml');
fs   = require('fs');

var getHieraConfig = function(hieraConfigFile) {
  return(yaml.safeLoad(fs.readFileSync(hieraConfigFile, 'utf8')));
}

var getHieraHierarchies = function(hieraConfigFile) {
  var hieraConfig = getHieraConfig(hieraConfigFile);

  return(hieraConfig[':hierarchy']);
}

var getHieraBackends = function(hieraConfigFile) {
  var hieraConfig = getHieraConfig(hieraConfigFile);

  return(hieraConfig[':backends']);
}

var getHieraBackendConfig = function(hieraConfigFile, hieraBackend) {
  var hieraConfig = getHieraConfig(hieraConfigFile);

  return(hieraConfig[':' + hieraBackend]);
}

module.exports = {
    getHieraHierarchies   : getHieraHierarchies,
    getHieraBackends      : getHieraBackends,
    getHieraBackendConfig : getHieraBackendConfig
};
