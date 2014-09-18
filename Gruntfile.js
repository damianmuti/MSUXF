module.exports = function (grunt) {

  'use strict';

  // Load Grunt tasks declared in the package.json file
  require('load-grunt-tasks')(grunt);


  // Project settings
  var config = {
    
    // Folders for assets, development environment and production environment
    folder_local: 'dev',
    folder_public: 'dist',
    folder_assets: 'assets',

    // Server info
    server_hostname: 'localhost',
    server_port: 1337

  };


  // Configure Grunt 
  grunt.initConfig({

    // Project settings
    config: config,


    /* ====================================================================================== */
    /* Development tasks                                                                      */
    /* ====================================================================================== */


    // grunt-watch monitors the projects files and execute actions when a file changes
    watch: {
      options: {
        livereload: true
      },
      css: {
          files: ['<%= config.folder_local %>/css/styles.css']
      },
      js: {
          files: ['<%= config.folder_local %>/js/**.*']
      },
      views: {
          files: ['<%= config.folder_local %>/*.html']
      },
      images: {
        files: '<%= config.folder_assets %>/images/*.*',
        tasks: ['copy:images']
      },
      icons: {
        files: '<%= config.folder_assets %>/icon-library/*.*',
        tasks: ['webfont']
      }
    },


    // Create an icon font from SVG files insode /icons folder
    webfont: {
      icons: {
        src: '<%= config.folder_assets %>/icon-library/*.svg',
        dest: '<%= config.folder_local %>/fonts',
        destCss: '<%= config.folder_assets %>/styles/libs/iconfont',
        options: {
          font: 'icon-font',
          hashes: false,
          engine: 'node',
          stylesheet: 'scss',
          relativeFontPath: '../fonts/',
          // syntax: 'bootstrap',
          htmlDemo: false,
          skip: true, // Set this variable to false to create the icon font. If /icons folder is empty, leave this variable as is
          templateOptions: {
            baseClass: 'ms-icon',
            classPrefix: 'icon-'
          }
        }    
      }
    },


    // grunt-open will open your browser at the project's URL
    open: {
      source: {
        path: 'http://localhost:1337'
      }
    },


    // Copy only the needed resources from Bower
    bowercopy: {
      options: {
        // Bower components folder will be removed afterwards
        clean: true
      },
      // CSS Normalizer
      normalize: {
        options: {
            destPrefix: '<%= config.folder_assets %>/styles/libs'
        },
        files: {
          'normalize': 'normalize.scss'
        }
      },
      // Jeet Grid System
      jeet: {
        options: {
            destPrefix: '<%= config.folder_assets %>/styles/libs'
        },
        files: {
          'jeet': 'jeet.gs/scss/jeet'
        }
      },
      // Modernizr
      modernizr: {
        options: {
            destPrefix: '<%= config.folder_local %>/js/vendor'
        },
        files: {
          'modernizr.js': 'modernizr/modernizr.js'
        }
      },
      // jQuery version for modern browsers
      jquerymodern: {
        options: {
            destPrefix: '<%= config.folder_local %>/js/vendor'
        },
        files: {
          'jquery-2.1.1.js': 'jquery-modern/dist/jquery.js'
        }
      },


      
      // // jQuery version for legacy browser
      // jquerylegacy: {
      //   options: {
      //       destPrefix: 'source/js/vendor'
      //   },
      //   files: {
      //     'jquery-1.11.0.js': 'jquery-legacy/dist/jquery.js'
      //   }
      // },
      // // jQuery version for legacy browsers
      // jquerymigrate: {
      //   options: {
      //       destPrefix: 'source/js/vendor'
      //   },
      //   files: {
      //     'jquery-migrate.js': 'jquery-migrate/jquery-migrate.js'
      //   }
      // },
      // // CSS3 Pie
      // css3pie: {
      //   options: {
      //       destPrefix: 'source/scripts'
      //   },
      //   files: {
      //     'PIE.htc': 'css3pie/PIE.htc'
      //   }
      // },
      // // Selectivizr
      // selectivizr: {
      //   options: {
      //       destPrefix: 'source/js/vendor'
      //   },
      //   files: {
      //     'selectivizr-1.0.2.js': 'selectivizr/selectivizr.js'
      //   }
      // },
      // // Polyfill to support box-sizing
      // polyfillboxsizing: {
      //   options: {
      //       destPrefix: 'source/scripts'
      //   },
      //   files: {
      //     'boxsizing.htc': 'box-sizing-polyfill/boxsizing.htc'
      //   }
      // },
      // // Polyfill to support input placeholders 
      // polyfillplaceholders: {
      //   files: {
      //     'source/js/plugins/placeholder_polyfill.jquery.min.combo.js': 'html5-placeholder-polyfill/dist/placeholder_polyfill.jquery.min.combo.js',
      //     'assets/styles/libs/html5-placeholder-polyfill/_html5-placeholder-polyfill.scss': 'html5-placeholder-polyfill/src/placeholder_polyfill.css'
      //   }
      // },
    },


    // Every time an image gets updated or a new image is saved in the images folder, Grunt will copy all the images to the source folder
    copy: {
      dev: {
        expand: true,
        cwd: '<%= config.folder_assets %>/images',
        src: '**',
        dest: '<%= config.folder_local %>/img',
        filter: 'isFile',
      }
    },


    // Get a local server running
    connect: {
      server: {
        options: {
          port: '<%= config.server_port %>',
          base: '<%= config.folder_local %>/',
          hostname: '<%= config.server_hostname %>',
          livereload: true
        }
      }
    },


    // Execute concurrent tasks in Grunt
    concurrent: {
      watch: {
        tasks: [
          'watch',          // Watch if files change
          'shell:sass',     // Run console command to compile Sass
          'open'            // Open the server URL in a browser
        ],
        options: {
          logConcurrentOutput: true, 
          limit: 4 // Limit the cores usage to 4
        }
      }
    },


    // Run shell commands as a Grunt task
    shell: {
      // Run Sass compiling with watch, compass and sourcemap flags
      sass: {
        command: 'sass --watch --compass --sourcemap ' + '<%= config.folder_assets %>/styles/styles.scss:<%= config.folder_local %>/css/styles.css'
      }
    },


    clean: {
      build: {
        src: [
          '<%= config.folder_local %>/css', 
          'dev/js/vendor', 
          '<%= config.folder_assets %>/styles/libs/jeet', 
          '<%= config.folder_assets %>/styles/libs/normalize', 
          '<%= config.folder_local %>/images',  
          '<%= config.folder_local %>/fonts'
        ]
      }
    },




    // /* ====================================================================================== */
    // /* Production tasks                                                                       */
    // /* ====================================================================================== */


    useminPrepare: {
      options: {
        dest: '<%= config.folder_public %>'
      },
      html: '<%= config.folder_local %>/{,*/}*.html'
    },

    usemin: {
      html: ['<%= config.folder_local %>/{,*/}*.html']
    },

    // uglify: {
    //   dist: {
    //     files: {
    //       '<%%= config.folder_public %>/scripts/scripts.js': [
    //         '<%%= config.folder_public %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },

    concat: { 
      generated: { 
        files: [ 
          { // Plugins
            dest: '<%= config.folder_local %>/js/plugins.js', 
            src: '<%= config.folder_local %>/js/plugins/{,*/}*'
          }
        ] 
      } 
    }

    // Compress images
    // imagemin: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: 'public/images',
    //       src: '{,*/}*.{gif,jpeg,jpg,png}',
    //       dest: 'source/images'
    //     }]
    //   }
    // },


    // // Minify SVG files
    // svgmin: {  
    //   options: {  
    //     plugins: [{
    //         removeViewBox: false
    //     }, {
    //         removeUselessStrokeAndFill: false
    //     }, {
    //         convertPathData: { 
    //             straightCurves: false
    //         }
    //     }]
    //   },
    //   dist: { 
    //     files: [{ 
    //         expand: true,             // Enable dynamic expansion.
    //         cwd: 'source/images',     // Src matches are relative to this path.
    //         src: ['**/*.svg'],        // Actual pattern(s) to match.
    //         dest: 'public/images',    // Destination path prefix.
    //         ext: '.svg'               // Dest filepaths will have this extension.
    //     }]
    //   }
    // },


    // // Minify/Uglify JS files
    // uglify: {
    //   dist: {
    //     files: {
    //       'source/scripts/main.js': [
    //           'source/scripts/main.js'
    //       ],
    //       'source/scripts/vendor.js': [
    //           'source/scripts/vendor.js'
    //       ],
    //       'source/scripts/plugins.js': [
    //           'source/scripts/plugins.js'
    //       ]
    //     }
    //   }
    // },


    // // Concatenate JS files
    // concat: {
    //   vendor: {
    //     src: [ 'source/scripts/vendor/*.js' ],
    //     dest: 'source/scripts/vendor.js'
    //   },
    //   plugins: {
    //     src: [ 'source/scripts/plugins/*.js' ],
    //     dest: 'source/scripts/plugins.js'
    //   }
    // },


    // // Clean up unnecessary files while building source version
    // clean: {
    //   build: {
    //     src: [
    //       "source/css/*.map", 
    //       "source/scripts/vendor", 
    //       "source/scripts/plugins", 
    //       "source/images/*.md",  
    //       "source/css/*.md", 
    //       "source/fonts/*.md"
    //     ]
    //   }
    // },


    // // Copy folder to make a distributable version of the website
    // copy: {
    //   main: {
    //     expand: true,
    //     cwd: 'public/',
    //     src: '**',
    //     dest: 'source/',
    //     filter: 'isFile',
    //   },
    // },


    // // Minify CSS for source/production release
    // cssmin: {
    //   minify: {
    //     expand: true,
    //     cwd: 'source/css/',
    //     src: ['*.css'],
    //     dest: 'source/css/',
    //     ext: '.css'
    //   }
    // }

    
  });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-usemin');



  /* ====================================================================================== */
  /* Tasks @registration                                                                    */
  /* ====================================================================================== */

  // grunt.registerTask('build', [
  //   'bowercopy',
  //   'copy',
  //   'webfont'
  // ]);

  grunt.registerTask('run', [
    'bowercopy',
    'copy',
    'connect:server',
    'webfont',
    'concurrent:watch'
  ]);

  grunt.registerTask('build', [
    'useminPrepare',
    'concat',
    'usemin'
  ]);

  // // Creates the 'build' task
  // grunt.registerTask('build', [
  //   'bowercopy',
  //   'webfont',
  //   'compass',
  //   'copy',
  //   'svgmin',
  //   'imagemin',
  //   'concat',
  //   'uglify',
  //   'clean',
  //   'cssmin'    
  // ]);

  
};