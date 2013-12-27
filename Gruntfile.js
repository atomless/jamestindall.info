'use strict';

module.exports = function (grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    bowerrc: grunt.file.readJSON('.bowerrc'),


    yeoman: {
      dir: {
        app: './app',
        dist: './dist',
        bower: '<%= bowerrc.directory %>',
        scripts: {
          nm: './node_modules',
          vendor: './app/scripts/vendor',
          lib: './app/scripts/lib'
        }
      },
      host: '0.0.0.0',// Change this to '0.0.0.0' to access the server from outside.
      port: 9000
    },


    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['concurrent:preprocessorsDev', 'concat:dev']
      },
      compass: {
        options: { livereload: true },
        files: ['<%= yeoman.dir.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      browserify: {
        files: ['<%= yeoman.dir.app %>/scripts/**/*.js', 'test/{,*/}*.js'],
        tasks: ['browserify:main', 'concat:dev']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.dir.app %>/{,*/}*.html',
          '{.tmp,<%= yeoman.dir.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.dir.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.dir.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },


    connect: {
      options: {
        port: '<%= yeoman.port %>',
        livereload: 35731,
        hostname: '<%= yeoman.host %>'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.dir.app %>'
          ]
        }
      },
      test: {
        options: {
          base: [
            '.tmp',
            'test',
            '<%= yeoman.dir.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: '',
          livereload: false
        }
      }
    },


    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dir.dist %>/*',
            '!<%= yeoman.dir.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },


    concurrent: {
      preprocessorsDist: [
        'browserify:main',
        'browserify:vendor',
        'compass:dist'
      ],
      preprocessorsDev: {
        tasks: [
          'browserify:main',
          'browserify:vendor',
          'compass:server'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      minify: [
        'imagemin',
        'cssmin',
        'htmlmin'
      ],
      tests: [
        'jshint'
        // 'karma'
      ]
    },


    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.dir.app %>/scripts/*.js',
        '<%= yeoman.dir.app %>/scripts/lib/{,*/}*.js',
        '<%= yeoman.dir.app %>/scripts/controllers/{,*/}*.js'
      ]
    },
    // karma: {
    //   unit: {
    //     configFile: './karma.conf.js',
    //     singleRun: true
    //   }
    // },
    compass: {
      options: {
        config: '.compass.rb',// found in the project root, this is where zurb-foundation and compass  css frameowrks are required into the load path
        sassDir: '<%= yeoman.dir.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= yeoman.dir.app %>/images',
        javascriptsDir: '<%= yeoman.dir.app %>/scripts',
        fontsDir: '<%= yeoman.dir.app %>/styles/fonts',
        importPath: '<%= yeoman.dir.app %>/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },


    browserify: {
      vendor: {
        src: [
          //'<%= yeoman.dir.bower %>/angular/angular.js',
          //'<%= yeoman.dir.bower %>/async/lib/async.js',
          //'<%= yeoman.dir.app %>/scripts/vendor/fast-1.0.2.min.js',
          //'<%= yeoman.dir.app %>/scripts/vendor/css3-multi-column.min.js',
          '<%= yeoman.dir.bower %>/jquery/jquery.js',
          //'<%= yeoman.dir.app %>/scripts/vendor/*.js',
          '<%= yeoman.dir.app %>/scripts/lib/*.js',
          // '<%= yeoman.dir.bower %>/jquery.transit/jquery.transit.js',
          '<%= yeoman.dir.bower %>/animo.js/animo.js'
          //'<%= yeoman.dir.app %>/components/sidr/jquery.sidr.min.js',
          //'<%= yeoman.dir.app %>/scripts/vendor/jquery-mobile/jquery.mobile.min.js'
          //'<%= yeoman.dir.app %>/scripts/vendor/rem.min.js'
        ],
        dest: '.tmp/scripts/vendor.js',
        options: {
          //debug: true,
          //alias: '<%= yeoman.dir.app %>/scripts/lib/to-rem.js:toRem',
            // lodash: {
            //   path: '<%= yeoman.dir.bower %>/lodash/dist/lodash.js',
            //   exports: '_'
            // },
            // backbone: {
            //   path: '<%= yeoman.dir.bower %>/backbone/backbone.js',
            //   exports: 'Backbone',
            //   depends: {
            //     jquery: '$',
            //     lodash: '_'
            //   }
            // }
          // },
          // alias: [
          //   '<%= yeoman.dir.bower %>/lodash/dist/lodash.js:underscore',
          //   '<%= yeoman.dir.bower %>/backbone/backbone.js:backbone'
          // ],
          transform: ['debowerify', 'decomponentify', 'deamdify', 'deglobalify']//, 'uglifyify'],
        }
      },
      main: {
        src: ['<%= yeoman.dir.app %>/scripts/app.js'],
        dest: '.tmp/scripts/app.js',
        options: {
          //debug: true,
          external: [
            'jquery',
            //'toRem',
            'animo.js'
          ],
          transform: [
            'debowerify',
            'decomponentify',
            'deamdify',
            'deglobalify'
          ]
        }
      },
      test: {
        src: ['test/{,*/}*.js'],
        dest: '.tmp/test/test.js',
        options: {
          debug: true,
          external: ['jQuery']
          // ignore: ['test/lib/*.js', 'test/spec/*.js']
        }
      }
    },

    // usemin prepare is for build blocks in the html and css source files
    // useminPrepare: {
    //   html: '<%= yeoman.dir.app %>/index.html',
    //   css: '<%= yeoman.dir.app %>/styles/{,*/}*.css',
    //   options: {
    //     dest: '<%= yeoman.dir.dist %>',
    //     patterns: {
    //       html: [
    //         [/(app\.js)/, 'Replacing reference to app.js']
    //       ]
    //     },
    //     flow: {
    //       steps: {
    //         'js': ['uglifyjs'],//['browserify', 'ngmin', 'uglify', 'rev'],
    //         'css': ['cssmin']//, 'rev']
    //       },
    //       post: []
    //     }
    //   }
    // },


    usemin: {
      html: [
        '<%= yeoman.dir.dist %>/index.html'
      ],
      css: '<%= yeoman.dir.dist %>/styles/{,*/}*.css',
      options: {
        dest: ['<%= yeoman.dir.dist %>']
      }
    },


    // ngmin is a pre-minifier that adds annotations so that AngularJS src files can be safely minified. It should be executed after files have been concatenated by concat or browserify
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dir.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dir.dist %>/scripts'
        }]
      }
    },


    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dir.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dir.dist %>/images'
        }]
      }
    },


    cssmin: {
      dist: {
        options: {
          banner: '/* James Tindall css file */'
        },
        files: {
          '<%= yeoman.dir.dist %>/styles/app.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.dir.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },


    htmlmin: {
      dist: {
        options: {
          removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          //removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          //removeEmptyAttributes: true,
          //removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dir.app %>',
          src: ['404.html', 'index.html', 'views/*.html'],
          dest: '<%= yeoman.dir.dist %>'
        }]
      }
    },


    concat: { // runs after browserify has bundled scripts into two separate app and vendor files
      options: {
        banner: '/*!\n * <%= pkg.name %>-<%= pkg.version %>\n * <%= pkg.author %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n */\n\n'
      },
      dev: {
        src: ['.tmp/scripts/vendor.js', '.tmp/scripts/app.js'],
        dest: '.tmp/scripts/main.js'
      },
      dist: {
        src: ['.tmp/scripts/vendor.js', '.tmp/scripts/app.js'],
        dest: '<%= yeoman.dir.dist %>/scripts/main.js'
      }
    },


    uglify: {
      options: {
        mangle: false,
        compress: false,
        beautify: true,
        report: 'min',
        // preserveComments: function (comment) {
        //   return (comment === false);
        // },
        banner: '/*\n * James Tindall \n * Copyright 2013 \n * MIT LICENCE \n */\n\n'
      },
      dist: {
        files: {
          '<%= yeoman.dir.dist %>/scripts/main.js': [
            '<%= yeoman.dir.dist %>/scripts/main.js'
          ]
        }
      }
    },


    rev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      js: '<%= yeoman.dir.dist %>/scripts/{,*/}*.js',
      css: '<%= yeoman.dir.dist %>/styles/{,*/}*.css',
      img: '<%= yeoman.dir.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
      font: '<%= yeoman.dir.dist %>/styles/fonts/*'
    },


    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.dir.app %>',
          dest: '<%= yeoman.dir.dist %>',
          src: [
            '!./components',
            '*.{ico,txt,rdf,xrdf}',
            'google098bd9ad020dd671.html',
            '.htaccess',
            'images/{,*/}*.{gif,webp}',
            'styles/fonts/*',
            '*.json',
            'LICENSE',
            '*.md'
          ]
        }]
      }
    }


  });

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:preprocessorsDev',
      'concat:dev',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function() {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:tests',
    'concurrent:preprocessorsDist',
    'connect:test',
    // 'karma',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    //'concurrent:tests',
    'concurrent:preprocessorsDist',
    'concurrent:minify',
    'concat:dist',
    'copy:dist',
    //'ngmin',
    'uglify',
    //'copy:dist',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
