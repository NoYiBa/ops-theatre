module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc : {
        dist : {
            src: [
              'Gruntfile.js',
              'app.js',
              'lib/*.js',
              'modules/*/controllers/*.js',
              'frontends/angular/lib/*.js',
              'frontends/angular/app.js',
              'frontends/angular/public/modules/*/*/*.js'
            ],
            options: {
                destination: 'jsdoc'
            }
        }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'app.js',
        'lib/*.js',
        'modules/*/controllers/*.js',
        'frontends/angular/lib/*.js',
        'frontends/angular/app.js',
        'frontends/angular/public/modules/*/*/*.js'
        ]
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Jshint provides linting
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
