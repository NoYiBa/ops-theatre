module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-loopback-angular');
  grunt.initConfig({
    loopback_angular: {
      options: {
        input: 'app.js',
        output: 'public/js/lb-services.js'
      }
    }
  });
  grunt.registerTask('default', ['loopback_angular']);
}
