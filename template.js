/*
 * grunt-init-webseiten
 * https://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a basic Gruntfile.';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'This template tries to guess file and directory paths, but ' +
  'you will most likely need to edit the generated Gruntfile.js file before ' +
  'running grunt. _If you run grunt after generating the Gruntfile, and ' +
  'it exits with errors, edit the file!_';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = 'Gruntfile.js';

// The actual init template.
exports.template = function(grunt, init, done) {
  var base_path = grunt.option('base_path') || process.env["HOME"];

  init.prompts.name.default(null, {}, function(err, value) {
    var props = { name: value };
    props.dom = true;
    props.port = 9999;
    props.base_path = base_path;
    props.projects_path = [base_path, "Projects", props.name].join("/");
    props.source_path = [base_path, "Source", props.name].join("/");
    props.docs_path = [base_path, "Documents", props.name].join("/");
    props.public_path = [base_path, "Sites", props.name].join("/");
    props.assets_dir = "assets/";
    props.package_json = true;
    props.test_task = props.dom ? 'qunit' : 'nodeunit';
    props.file_name = props.package_json ? '<%= pkg.name %>' : 'FILE_NAME';

    // Find the first `preferred` item existing in `arr`.
    function prefer(arr, preferred) {
      for (var i = 0; i < preferred.length; i++) {
        if (arr.indexOf(preferred[i]) !== -1) {
          return preferred[i];
        }
      }
      return preferred[0];
    }

    grunt.file.mkdir(props.public_path);
    grunt.file.mkdir(props.docs_path);
    grunt.file.mkdir(props.source_path);

    // Guess at some directories, if they exist.
    var dirs = grunt.file.expand({filter: 'isDirectory'}, '*').map(function(d) { return d.slice(0, -1); });
    props.lib_dir = prefer(dirs, ['lib', 'src']);
    props.test_dir = prefer(dirs, ['test', 'tests', 'unit', 'spec']);

    // Maybe this should be extended to support more libraries. Patches welcome!
    props.jquery = grunt.file.expand({filter: 'isFile'}, '**/jquery*.js').length > 0;

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    grunt.template.addDelimiters('init', '[%', '%]');

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    init.writePackageJSON('package.json', {
      "name": props.name,
      "version": "0.0.0",
      "description": "A private Package for managing dependencies, building and deploying Webseiten",
      "main": "Gruntfile.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "repository": "",
      "author": "",
      "license": "BSD",
      "dependencies": {
        "grunt-recess": "~0.4.0",
        "grunt-contrib-concat": "~0.3.0",
        "grunt": "~0.4.1",
        "component": "*",
        "grunt-exec": "~0.4.2",
        "grunt-modernizr": "*",
        "grunt-contrib-watch": "~0.5.3",
        "grunt-contrib-jshint": "~0.6.4",
        "grunt-contrib-symlink": "*",
        "grunt-contrib-copy": "~0.4.1",
        "grunt-wintersmith": "0.0.2",
        "wintersmith-nunjucks": "*",
        "twitter-bootstrap-3.0.0": "~3.0.0"
      }
    });

    done();
  });

};
