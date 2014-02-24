/*global module:false*/
module.exports = function(grunt) {  
  var configureImageStyles = function(src, dest) {
    var imageStyles = {
      "icon": { width: 64, height: 64 },
      "hero": { width: 900 }
      },
      imageStyle = function(name, options) {
        return { 
          options: {
            width: options.width,
            height: options.height,
            overwrite: true
          },
          icon: {
            expand: true,
            cwd: src,
            src: "**/*.{jpg, png, gif}",
            dest: dest + name + "/",
          }
        };
      },
      imageStyleKeys = Object.keys(imageStyles);
      

    for (var i = imageStyleKeys.length - 1; i >= 0; i--) {
      var styleName = imageStyleKeys[i], style = imageStyles[styleName];
      imageStyles[styleName] = imageStyle(styleName, style);
    }

    return imageStyles;
  };

  
 // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.loadNpmTasks("grunt-lint-inline");
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks("grunt-image-resize");
  grunt.loadNpmTasks("grunt-image-embed");
  grunt.loadNpmTasks('grunt-wintersmith');
  grunt.loadNpmTasks('grunt-modernizr');
  
  // nginx support needs it, and it's handy for component as well
  grunt.loadNpmTasks('grunt-exec');

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
      imageStyles: "[%= assets_dir %]styles/",
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
      build: {
        devFile: "devel/modernizr.js",
        outputFile: "<%= main.build %>modernizr.js",
        uglify: false,
        extensibility: {
          mq: true,
          prefixed: true
        },
        excludeFiles: ["Gruntfile.js", "<%= main.build %>/*"]
      }
    },
    inlinelint: {
      options: {
        jshintrc: ".jshintrc"
      },
      html: {
        src: [
          "<%= main.templates %>/**/*.html",
          "<%= main.templates %>/**/*.php"
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: true
      }
    },
    uglify: {
      ui: {
        src: "<%= concat.js.dest %>",
        dest: "<%= concat.js.dest %>"
      }
    },
    compress: {
      dist: {
        options: {
          archive: "<%= main.build %><%= pkg.name %>-<%= pkg.version %>-dist.tar.gz",
          mode: "tgz"
        },
        cwd: "<%= main.build %>dist/",
        expand: true,
        src: "**/*.html",
        dest: "<%= pkg.name %>-<%= pkg.version %>"
      }
    },
    imageEmbed: {
      dist: {
        cwd: "<%= main.dest %>css/",
        src: ['**/*.css'],
        expand: true,
        dest: '<%= main.dest %>css/',
        options: {
          maxImageSize: 0,
          //baseDir: /',
          deleteAfterEncoding: false
        }
      }
    },
    image_resize: configureImageStyles("<%= main.imageStyles %>", "<%= main.dest %><%= main.imageStyles %>"),
    watch: {
      docs: {
        files: ['<%= main.docs %>**/*', 'templates/*'],
        tasks: ['wintersmith', 'copy']
      },
      templates: {
        files: ['templates/*'],
        tasks: ['wintersmith'],
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
    less: {
      options: {
        // compile: true,
        paths: "<%= main.src %>"
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
      }
    },
    concat: {
      css: {
        src: [
          "<% main.build %>components.css",
          // "<%= main.frozen %>css/animate/animate.min.css",
          "<%= less.production.dest %>"
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
      },
      lib: {
        src: [
          "<%= main.src %>js/lib/**/*.js"
        ],
        dest: "<%= main.build %>/<%= pkg.name %>.ui.js"
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
      images: {
        src: ["**"],
        expand: true,
        cwd: "<%= main.src %>images/",
        dest: "<%= main.wintersmith %>images/"
      },
      image_styles: {
        expand: true,
        cwd: "<%= main.dest %><%= main.imageStyles %>",
        src: ["**"],
        dest: "<%= main.wintersmith %><%= main.imageStyles %>",
        filter: "isFile"
      },
      js: {
        src: ["**"],
        expand: true,
        cwd: "<%= main.dest %>js/",
        dest: "<%= main.wintersmith %>js/"
      },
      project: {
        src: ["<%= pkg.name %>.sublime-project"],
        dest: "[%= projects_path %].sublime-project",
        options: {
          overwrite: false
        }
      },
      mixmatch: {
        files: [{
          dest: "<%= main.src %>css/[%= name %]/variables.less",
          src: ["<%= main.src %>css/bootstrap/variables.less"]
        }],
        options: {
          overwrite: false
        }
      },
      imageEmbed: {
        src: ["**"],
        expand: true,
        cwd: "<%= copy.css.dest %>",
        dest: "<%= main.build %>css/"
      },
      bundle: {
        expand: true,
        cwd: "<%= main.wintersmith %>/../",
        src: "**/*.html",
        dest: "<%= main.build %>dist/",
        options: {
          process: function(content) { /*, srcpath */
            var cssrxp = /<link[^>]*href='([^']+)'[^>]*>/,
              jsrxp = /<script[^>]*src='([^']+)'[^>]*>[^<]*<\/script>/,
              root = grunt.config.get("main.wintersmith").replace(/assets\/$/, ""),
              inline = {
                css: function(match, href) {

                  var file = grunt.file.read(root + href);

                  return "<style>\n" + file + "\n</style>";
                },
                js: function(match, src) {
                  var file = grunt.file.read(root + src);

                  return "<script type=text/javascript>" + file + "</script>";
                }
              };

            return content.replace(cssrxp, inline.css).replace(jsrxp, inline.js);
          }
        }
      }
    },
    symlink: {
      bootstrap: {
        files: [{
          expand: true,
          cwd: "node_modules/bootstrap/less",
          src: ['**/*.less'],  
          dest: '<%= main.src %>css/bootstrap'
        },
        {
          expand: true,
          cwd: "node_modules/bootstrap/js",
          src: ['**/*.js'],
          dest: '<%= main.src %>js/bootstrap'
        },
        {
          expand: true,
          cwd: "node_modules/bootstrap/fonts",
          src: ['**/*'],
          dest: '<%= main.frozen %>fonts'
        },
        {
          expand: true,
          cwd: "node_modules/bootstrap/fonts",
          src: ['**/*'],
          dest: '<%= main.dest %>fonts' // FIXME: for image embedding
        }]
      }
    },
    clean: {
      build: {
        src: ["<%= main.dest %>"]
      },
      wintersmith: {
        src: ["<%= main.wintersmith %>"]
      }
    },
    autoprefixer: {
      dist: {
        src: "<%= main.dest %>css/<%= pkg.name %>.css",
        dest: "<%= main.dest %>css/<%= pkg.name %>.css",
        options: {
          diff: true,
          browsers: ["last 5 version", "ie 8", "ie 9"]
        }
      }
    },
    cssmin: {
      minify: {
        src: ["<%= autoprefixer.dist.dest %>"],
        dest: "<%= main.dest %>css/<%= pkg.name %>.css"
      }
    }
  });

  grunt.registerTask('libs', [
    'modernizr',
    'concat:lib',
    'exec:component'
  ]);

  grunt.registerTask('css', [
    'less:production',
    "autoprefixer:dist"
  ]);

  grunt.registerTask('js', [
    'jshint'
  ]);

  grunt.registerTask('listen', [
    'less:production',
    'watch'
  ]);

  grunt.registerTask('serve', [
    'libs',
    'js',
    'css',
    'wintersmith',
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
    'uglify:ui',
    'copy:frozen',
    'copy:css',
    'copy:js',
    "image_resize",
    "copy:image_styles",
    'copy:images',
  ]);

  grunt.registerTask('bundle', [
    'symlink:bootstrap', // assure static fonts are ready
    'copy:imageEmbed',
    'imageEmbed:dist',
    'copy:bundle',
  ]);

  grunt.registerTask('dist', [
                     'bundle',
                     'compress:dist'
                     ]);
  
  grunt.registerTask('bundle:full', [
    'default',
    'bundle'
  ]);
  // Default task.
  grunt.registerTask('default', [
    'clean:build',
    'libs',
    'js',
    'css',
    'wintersmith',
    'combine'
  ]);

  // facilities
  //  'libs',
    // 'js',
    // 'css',
    // 'wintersmith',
    // 'combine'

  // vivadi
  // "jshint", "inlinelint", "less:production", "autoprefixer", "cssmin"
  // online
// "clean:build",
//     "libs",
//     "js",
//     "css",
//     "wintersmith",
//     "combine"
};
