/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    main: {
      docs: "[%= docs_path %]",
      wintersmith: "[%= public_path %]/[%= assets_dir %]",
      src: "[%= assets_dir %]",
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
      },
      nginx: {
        cmd: function(action) {
          var signal = (action === "start") ? "": "-s " + action;
          return "nginx -c '" + __dirname + "/nginx.conf' " + signal;
        }
      }
    },
    modernizr: {
      devFile: "devel/modernizr.js",
      outputFile: "<%= main.build %>modernizr.js",
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
      // docs: {
      //   files: ['<%= main.docs %>**/*', 'templates/*'],
      //   tasks: ['wintersmith:preview', 'copy']
      // },
      templates: {
        files: ['templates/*'],
        tasks: ['wintersmith:preview'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['<%= main.src %>js/<%= pkg.name %>.js'],
        tasks: ['js', 'concat:js', 'copy:js']
      },
      css: {
        files: [
          '<%= main.src %>css/<%= pkg.name %>.less'
        ],
        tasks: ['css', 'concat:css', 'copy:css'],
        options: {
          livereload: true
        }
      },
      lib: {
        files: [
          'lib/**/*.js'
        ],
        tasks: [],
        options: {
          livereload: true
        }
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
          config: "./wintersmith.preview.json"
        }
      }
    },
    concat: {
      css: {
        src: [
          "<% main.build %>components.css",
          "<%= recess.production.dest %>"
        ],
        dest: "<%= main.dest %>/css/<%= pkg.name %>.css"
      },
      js: {
        src: [
          "<%= main.build %>modernizr.js",
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
        dest: "<%= main.wintersmith %>"
      },
      css: {
        src: ["**"],
        expand: true,
        cwd: "<%= main.dest %>css/",
        dest: "<%= main.wintersmith %>css/"
      },
      js: {
        src: ["**"],
        expand: true,
        cwd: "<%= main.dest %>js/",
        dest: "<%= main.wintersmith %>js/"
      },
      project: {
        src: ["<%= pkg.name %>.sublime-project"],
        dest: "[%= projects_path %].sublime-project"
      },
      mixmatch: {
        files: [{
          dest: "<%= main.src %>css/[%= name %]/mixins.less",
          src : ["<%= main.src %>css/bootstrap/mixins.less"],
        },
        {
          dest: "<%= main.src %>css/[%= name %]/variables.less",
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

  grunt.registerTask('libs', [
    'modernizr',
    'exec:component'
  ]);

  grunt.registerTask('css', [
    'recess:production'
  ]);

  grunt.registerTask('js', [
    'jshint'
  ]);

  grunt.registerTask('listen', [
    'recess:production',
    'watch'
  ]);

  grunt.registerTask('serve', [
    'libs',
    'js',
    'css',
    'wintersmith:preview',
    'combine',
    'exec:nginx:start'
  ]);

  grunt.registerTask('scaffold', [
    'symlink:bootstrap',
    'copy:mixmatch',
    'copy:project'
  ]);

  grunt.registerTask('combine', [
    'concat',
    'copy:frozen',
    'copy:css',
    'copy:js'
  ]);

  // Default task.
  grunt.registerTask('default', [
    'libs',
    'js',
    'css',
    'wintersmith:build',
    'combine'
  ]);

};
