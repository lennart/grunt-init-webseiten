/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    main: {
      docs: "{%= docs_path %}",
      wintersmith: "{%= public_path %}/{%= assets_dir %}",
      src: "{%= assets_dir %}",
      build: "build/",
      frozen: "static/",
      dest: "public/",
    },
    // Task configuration.
   
    exec: {
      component: {
        cmd: function() {
          var bin = "./node_modules/.bin/component",
              build = [
            bin, "install",
            "&&",
            bin, "--prefix css",
            "--name components",
            "build"
          ].join(" ");

          return build;
        }
      }
    },
    modernizr: {
      devFile: "devel/modernizr.js",
      outputFile: "<%= main.dest %>/libs/modernizr.js",
      uglify: false,
      files: ["!Gruntfile.js", "!<%= main.build %>/*"]
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        options: {
          globals: {
            "__dirname": true
          }
        },
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js', '!lib/jquery.min.js']
      }
    },
    watch: {
      docs: {
        files: '<%= main.docs %>**/*',
        tasks: ['wintersmith:build', 'copy']
      },
      all: {
        files: ['<%= main.docs %>**/*', '<%= main.src %>**/*', 'templates/*'],
        tasks: ['wintersmith:build',  'copy']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      }
    },
    recess: {
      options: {
          compile: true,
          includePath: "<%= main.src %>bootstrap"
      },
      development: {
          src: ["<%= main.src %>css/<%= pkg.name %>.less", "<%= main.src %>css/devel.less"],
          dest: "<%= main.dest %>css/<%= pkg.name %>.css"
      },
      production: {
          options: {
              compress: true
          },
          src: ["<%= main.src %>css/<%= pkg.name %>.less"],
          dest: "<%= main.dest %>css/<%= pkg.name %>.css"
      }
    },
    wintersmith: {
      build: {
        options: {
          config: "./wintersmith.production.json"
        }
      },
      preview: {
        options: {
          action: "preview",
          config: "./wintersmith.preview.json"
        }
      }
    },
    concat: {
      css: {
        src: [
          "<% main.build %>/components.css",
          "<%= recess.production.dest %>"
        ],
        dest: "<%= main.dest %>/css/<%= pkg.name %>.css"
      },
      js: {
        src: [
          "<%= main.build %>/components.js",
          "<%= main.src %>/js/<%= pkg.name %>.js"
        ],
        dest: "<%= main.dest %>/js/<%= pkg.name %>.js"
      }
    },
    copy: {
      frozen: {
        src: ["**"],
        expand: true,
        cwd: "<%= main.frozen %>",
        dest: "<%= main.wintersmith %>/"
      },
      assets: {
        src: ["**"],
        expand: true,
        cwd: "<%= main.dest %>/",
        dest: "<%= main.wintersmith %>/"
      },
      project: {
        src: ["<%= pkg.name %>.sublime-project"],
        dest: "{%= projects_path %}.sublime-project"
      },
      mixmatch: {
        files: [{
          dest: "<%= main.src %>css/{%= name %}/mixins.less",
          src : ["<%= main.src %>css/bootstrap/mixins.less"],
        },
        {
          dest: "<%= main.src %>css/{%= name %}/variables.less",
          src: ["<%= main.src %>css/bootstrap/variables.less"]
        }]
      }
    },
    symlink: {
      bootstrap: {
        files: [{
          expand: true,
          cwd: "node_modules/twitter-bootstrap-3.0.0/less",
          src: ['**/*.less'],  
          dest: '<%= main.src %>css/bootstrap'
        },
        {
          expand: true,
          cwd: "node_modules/twitter-bootstrap-3.0.0/js",
          src: ['**/*.js'],
          dest: '<%= main.src %>js/bootstrap'
        },
        {
          expand: true,
          cwd: "node_modules/twitter-bootstrap-3.0.0/fonts",
          src: ['**/*'],
          dest: '<%= main.frozen %>fonts/bootstrap'
        }]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-wintersmith');
  grunt.loadNpmTasks('grunt-modernizr');
  
  // nginx support needs it
  grunt.loadNpmTasks('grunt-exec');

  // Default task.
  grunt.registerTask('default', [
    'jshint',
    'recess:production',
    'modernizr',
    'exec:component',
    'wintersmith:build',
    'concat',
    'copy:frozen',
    'copy:assets'
  ]);

  grunt.registerTask('preview', [
    'recess:development',
    'watch:all'
  ]);

  grunt.registerTask('scaffold', [
    'symlink:bootstrap',
    'copy:mixmatch',
    'copy:project'
  ]);

};
