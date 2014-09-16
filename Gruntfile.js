module.exports = function (grunt) {

  'use strict';

  // Load Grunt tasks declared in the package.json file
  require('load-grunt-tasks')(grunt);

  // Configure Grunt 
  grunt.initConfig({


    /* ====================================================================================== */
    /* publicelopment tasks                                                                      */
    /* ====================================================================================== */


    // grunt-watch monitors the projects files
    // watch: {
    //   options: {
    //     livereload: true
    //   },
    //   css: {
    //       files: ['public/css/styles.css']
    //   },
    //   js: {
    //       files: ['public/js/**.*']
    //   },
    //   views: {
    //       files: ['public/*.html']
    //   },
    //   images: {
    //     files: 'assets/images/*.*',
    //     tasks: ['copy:images']
    //   },
    //   icons: {
    //     files: 'assets/icon-library/*.*',
    //     tasks: ['webfont']
    //   }
    // },


    // // Create an icon font from SVG files insode /icons folder
    // webfont: {
    //   icons: {
    //     src: 'assets/icon-library/*.svg',
    //     dest: 'public/fonts',
    //     destCss: 'assets/styles/libs/iconfont',
    //     options: {
    //       font: 'icon-font',
    //       hashes: false,
    //       engine: 'node',
    //       stylesheet: 'scss',
    //       relativeFontPath: '../fonts/',
    //       // syntax: 'bootstrap',
    //       htmlDemo: false,
    //       skip: false, // Set this variable to false to create the icon font. If /icons folder is empty, leave this variable as is
    //       templateOptions: {
    //         baseClass: 'ms-icon',
    //         classPrefix: 'icon-'
    //       }
    //     }    
    //   }
    // },


    // // grunt-open will open your browser at the project's URL
    // open: {
    //   public: {
    //     // Gets the port from the connect configuration
    //     path: 'http://localhost:3000'
    //   }
    // },


    // Copy only the needed resources from Bower
    bowercopy: {
      options: {
        // Bower components folder will be removed afterwards
        clean: true
      },
      normalize: {
        // Target-specific file lists and/or options go here
        options: {
            destPrefix: 'assets/styles/libs'
        },
        files: {
          'normalize': 'normalize.scss'
        }
      },
      jeet: {
        // Target-specific file lists and/or options go here
        options: {
            destPrefix: 'assets/styles/libs'
        },
        files: {
          'jeet': 'jeet.gs/scss/jeet'
        }
      },
      modernizr: {
        // Target-specific file lists and/or options go here
        options: {
            destPrefix: 'public/js/vendor'
        },
        files: {
          'modernizr.js': 'modernizr/modernizr.js'
        }
      },
      jquerymodern: {
        // Target-specific file lists and/or options go here
        options: {
            destPrefix: 'public/js/vendor'
        },
        files: {
          'jquery-2.1.1.js': 'jquery-modern/dist/jquery.js'
        }
      },

      /* Keep legacy support - IE8 */
      /*
      jquerylegacy: {
        // Target-specific file lists and/or options go here
        options: {
            destPrefix: 'public/js/vendor'
        },
        files: {
          'jquery-1.11.0.js': 'jquery-legacy/dist/jquery.js'
        }
      },
      jquerymigrate: {
        // Target-specific file lists and/or options go here
        options: {
            destPrefix: 'public/js/vendor'
        },
        files: {
          'jquery-migrate.js': 'jquery-migrate/jquery-migrate.js'
        }
      },
      css3pie: {
        // Target-specific file lists and/or options go here
        options: {
            destPrefix: 'public/scripts'
        },
        files: {
          'PIE.htc': 'css3pie/PIE.htc'
        }
      },
      selectivizr: {
        // Target-specific file lists and/or options go here
        options: {
            destPrefix: 'public/js/vendor'
        },
        files: {
          'selectivizr-1.0.2.js': 'selectivizr/selectivizr.js'
        }
      },
      polyfillboxsizing: {
        // Target-specific file lists and/or options go here
        options: {
            destPrefix: 'public/scripts'
        },
        files: {
          'boxsizing.htc': 'box-sizing-polyfill/boxsizing.htc'
        }
      },
      polyfillplaceholders: {
        // Target-specific file lists and/or options go here
        files: {
          'public/js/plugins/placeholder_polyfill.jquery.min.combo.js': 'html5-placeholder-polyfill/dist/placeholder_polyfill.jquery.min.combo.js',
          'assets/styles/libs/html5-placeholder-polyfill/_html5-placeholder-polyfill.scss': 'html5-placeholder-polyfill/src/placeholder_polyfill.css'
        }
      },
      */
    },


    // // Copy folder to make a publicelopment version of the website
    // copy: {
    //   images: {
    //     expand: true,
    //     cwd: 'assets/images',
    //     src: '**',
    //     dest: 'public/img',
    //     filter: 'isFile',
    //   }
    // },


    // connect: {
    //   server: {
    //     options: {
    //       port: 3000,
    //       base: 'public/',
    //       hostname: 'localhost',
    //       livereload: true
    //     }
    //   }
    // },


    // // Execute concurrent tasks in Grunt
    // concurrent: {
    //   watch: {
    //     tasks: [
    //       'watch',
    //       'shell:sass', // Run console command to compile Sass
    //       //'shell:apache', // Run console command to serve files

    //       'open'
    //     ],
    //     options: {
    //         logConcurrentOutput: true,
    //         limit: 4
    //     }
    //   }
    // },


    // Run shell commands as a Grunt task
    // 
    // shell: {
    //   // Run Sass compiling with watch, compass and sourcemap flags
    //   sass: {
    //     command: 'sass --watch --compass --sourcemap assets/styles/styles.scss:public/css/styles.css'
    //   }
    // },




    // /* ====================================================================================== */
    // /* Production tasks                                                                       */
    // /* ====================================================================================== */

    // // Compress images
    // imagemin: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: 'publicelopment/images',
    //       src: '{,*/}*.{gif,jpeg,jpg,png}',
    //       dest: 'public/images'
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
    //         expand: true,       // Enable dynamic expansion.
    //         cwd: 'public/images',     // Src matches are relative to this path.
    //         src: ['**/*.svg'],  // Actual pattern(s) to match.
    //         dest: 'public/images',       // Destination path prefix.
    //         ext: '.svg'     // Dest filepaths will have this extension.
    //     }]
    //   }
    // },


    // // Minify/Uglify JS files
    // uglify: {
    //   dist: {
    //     files: {
    //       'public/scripts/main.js': [
    //           'public/scripts/main.js'
    //       ],
    //       'public/scripts/vendor.js': [
    //           'public/scripts/vendor.js'
    //       ],
    //       'public/scripts/plugins.js': [
    //           'public/scripts/plugins.js'
    //       ]
    //     }
    //   }
    // },


    // // Concatenate JS files
    // concat: {
    //   vendor: {
    //     src: [ 'public/scripts/vendor/*.js' ],
    //     dest: 'public/scripts/vendor.js'
    //   },
    //   plugins: {
    //     src: [ 'public/scripts/plugins/*.js' ],
    //     dest: 'public/scripts/plugins.js'
    //   }
    // },


    // // Clean up unnecessary files while building public version
    // clean: {
    //   build: {
    //     src: [
    //       "public/css/*.map", 
    //       "public/scripts/vendor", 
    //       "public/scripts/plugins", 
    //       "public/images/*.md",  
    //       "public/css/*.md", 
    //       "public/fonts/*.md"
    //     ]
    //   }
    // },


    // // Compass tasks for Grunt
    // compass: {  
    //   dist: { 
    //     options: {  
    //       sassDir: 'sass',
    //       cssDir: 'publicelopment/css',
    //       environment: 'production'
    //     }
    //   }
    // },


    // // Copy folder to make a distributable version of the website
    // copy: {
    //   main: {
    //     expand: true,
    //     cwd: 'publicelopment/',
    //     src: '**',
    //     dest: 'public/',
    //     filter: 'isFile',
    //   },
    // },


    // // Minify CSS for public/production release
    // cssmin: {
    //   minify: {
    //     expand: true,
    //     cwd: 'public/css/',
    //     src: ['*.css'],
    //     dest: 'public/css/',
    //     ext: '.css'
    //   }
    // }

    

    // kss: {
    //   options: {
    //     includeType: 'css',
    //     includePath: './prod/css',
    //     template: './template2'
    //   },
    //   dist: {
    //       files: {
    //         'styleguide': ['./public/sass/styles.scss']
    //       }
    //   }
    // },


    // styleguide: {
    //   options: {
    //     template: {
    //       src: 'template2',
    //       include: ['public/sass/**/*.scss']
    //     },
    //     framework: {
    //       name: 'kss'
    //     }
    //   },
    //   all: {
    //     files: [{
    //       'styleguide': 'public/sass/styles.scss',
    //       'styleguide/helpers': 'public/sass/helpers/_helpers.scss',
    //       'styleguide/': 'prod/css/styles.css'
    //     }]
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

    // grunt.loadNpmTasks('grunt-styleguide');
    // grunt.loadNpmTasks('grunt-kss');



  /* ====================================================================================== */
  /* Tasks @registration                                                                    */
  /* ====================================================================================== */

  // grunt.registerTask('styleguide', [
  //   'shell',
  //   'styleguide'
  // ]);

  // grunt.registerTask('build', [
  //   'bowercopy',
  //   'copy',
  //   'webfont'
  // ]);

  grunt.registerTask('run', [
    'bowercopy',
    // 'copy',
    // 'connect:server',
    // 'webfont',
    // 'concurrent:watch'
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