module.exports = function (grunt) {

  'use strict';

  // Load Grunt tasks declared in the package.json file
  require('load-grunt-tasks')(grunt);


  // Project settings
  var config = {
    
    // Folders for assets, development environment and production environment
    folder_dev: 'dev', // Local environment
    folder_dist: 'dist', // Production ready project
    folder_assets: 'assets' // Folder from which assets are copied/moved.

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
          files: [
            '<%= config.folder_dev %>/css/styles.css',
            '<%= config.folder_dev %>/css/mobile.css',
            '<%= config.folder_dev %>/css/oldbrowsers.css'
          ]
      },

      js: {
          files: ['<%= config.folder_dev %>/js/**.*']
      },

      views: {
          files: ['<%= config.folder_dev %>/*.html']
      },

      images: {
        files: '<%= config.folder_assets %>/images/*.*',
        tasks: ['clean:dev_images','copy:images']
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
        dest: '<%= config.folder_dev %>/fonts',
        destCss: '<%= config.folder_assets %>/styles/libs/iconfont',
        options: {
          font: 'icon-font',
          hashes: false,
          engine: 'node',
          stylesheet: 'scss',
          relativeFontPath: '../fonts/',
          // syntax: 'bootstrap',
          htmlDemo: false,
          skip: false, // Set this variable to false to create the icon font. If /icons folder is empty, leave this variable as is
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
        path: 'http://localhost'
      }
    },


    // Copy only the needed resources from Bower
    bowercopy: {
      options: {
        // Bower components folder will be removed afterwards
        clean: true
      },

      dev: {
        files: {
          '<%= config.folder_assets %>/styles/libs/normalize': 'normalize.scss',
          '<%= config.folder_assets %>/styles/libs/jeet': 'jeet.gs/scss/jeet',
          '<%= config.folder_dev %>/js/vendor/jquery.min.js': 'jquery-latest/dist/jquery.min.js'
        }
      }
    },


    // Every time an image gets updated or a new image is saved in the images folder, Grunt will copy all the images to the source folder
    copy: {
      images: {
        expand: true,
        cwd: '<%= config.folder_assets %>/images',
        src: '**',
        dest: '<%= config.folder_dev %>/img',
        filter: 'isFile',
      },

      dist: {
        expand: true,
        cwd: '<%= config.folder_dev %>/',
        src: '**',
        dest: '<%= config.folder_dist %>/',
        filter: 'isFile',
      },

      replacements: {
        expand: true,
        cwd: '<%= config.folder_assets %>/images',
        src    : [
          'aboutus_2011.jpg',
          'aboutus_2009.jpg',
          'aboutus_2007.jpg',
          'home_our_story_bg.jpg'
        ],
        dest: '<%= config.folder_dist %>/img'
      }
    },


    // Execute concurrent tasks in Grunt
    concurrent: {
      watch: {
        tasks: [
          'watch', // Watch if files change
          'shell:sass_watch', // Run console command to watch Sass compilation
          'open' // Open the server URL in a browser
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
      sass_compile: {
        command: 'sass --compass --sourcemap ' + '<%= config.folder_assets %>/styles/styles.scss:<%= config.folder_dev %>/css/styles.css <%= config.folder_assets %>/styles/mobile.scss:<%= config.folder_dev %>/css/mobile.css  <%= config.folder_assets %>/styles/oldbrowsers.scss:<%= config.folder_dev %>/css/oldbrowsers.css'
      },

      sass_watch: {
        command: 'sass --watch --compass --sourcemap ' + '<%= config.folder_assets %>/styles/styles.scss:<%= config.folder_dev %>/css/styles.css <%= config.folder_assets %>/styles/mobile.scss:<%= config.folder_dev %>/css/mobile.css <%= config.folder_assets %>/styles/oldbrowsers.scss:<%= config.folder_dev %>/css/oldbrowsers.css'
      }
    },


    clean: {
      dist: {
        src: [
          '<%= config.folder_dist %>/.htaccess', 
          '<%= config.folder_dist %>/css/*.map', 
          '<%= config.folder_dist %>/js/vendor/**.*', 
        ]
      },

      dev_images: {
        src: ['<%= config.folder_dev %>/img']
      }
    },




    /* ====================================================================================== */
    /* Production tasks                                                                       */
    /* ====================================================================================== */

    // Not currently in use, but will do
    useminPrepare: {
      options: {
        dest: '<%= config.folder_dist %>'
      },

      html: '<%= config.folder_dev %>/{,*/}*.html'
    },

    usemin: {
      html: ['<%= config.folder_dev %>/{,*/}*.html']
    },


    // Concatenate all plugins into a single file.
    concat: { 
      generated: { 
        files: [ 
          { // Plugins
            dest: '<%= config.folder_dev %>/js/plugins.js', 
            src: '<%= config.folder_dev %>/js/plugins/{,*/}*'
          }
        ] 
      } 
    },


    // Task configuration for kraken.io
    kraken: {
      options: {
        key: '',
        secret: '',
        lossy: true
      },
      dynamic: {
        files: [{
            expand: true,
            cwd: '<%= config.folder_dist %>/img/',
            src: ['**/*.{png,jpg,jpeg,gif}'],
            dest: '<%= config.folder_dist %>/img/'
        }]
      }
    },


    // Minify SVG files
    svgmin: {  
      options: {  
        plugins: [{
            removeViewBox: false
        }, {
            removeUselessStrokeAndFill: false
        }, {
            convertPathData: { 
                straightCurves: false
            }
        }]
      },
      dist: { 
        files: [{ 
            expand: true,
            cwd: '<%= config.folder_dist %>/img',
            src: ['**/*.svg'],
            dest: '<%= config.folder_dist %>/img',
            ext: '.svg'
        }]
      }
    },


    // Minify/Uglify JS files
    uglify: {
      js: {
        options: {
          beautify: {
            width: 80,
            beautify: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= config.folder_dist %>/js',
          src: '**/*.js',
          dest: '<%= config.folder_dist %>/js'
        }]
      }
    },


    // Minify CSS for source/production release
    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= config.folder_dist %>/css/',
        src: ['*.css'],
        dest: '<%= config.folder_dist %>/css/',
        ext: '.css'
      }
    },


    // Push production folder to FTP - Requires .ftpass file placed in this same level
    ftpush: {
      prod: {
        auth: {
          host: '104.236.13.130',
          port: 21,
          authKey: 'production'
        },
        src: '<%= config.folder_dev %>',
        dest: '/',
        exclusions: ['<%= config.folder_dev %>/**/.map', '<%= config.folder_dev %>/**/Thumbs.db', 'dist/tmp'],
        simple: false,
        useList: false
      }
    },

    
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
    grunt.loadNpmTasks('grunt-ftpush');
    grunt.loadNpmTasks('grunt-contrib-kraken');
    grunt.loadNpmTasks('grunt-contrib-cssmin');



  /* ====================================================================================== */
  /* Tasks @registration                                                                    */
  /* ====================================================================================== */

  // Build a 'dist' folder without minifications, concatenations and image compression
  grunt.registerTask('build', [
    'bowercopy:dev',
    'copy:images',
    'webfont',
    'shell:sass_compile',
    'copy:dist',
  ]);

  // Run the project and fire watchers to real-time compilation
  grunt.registerTask('run', [
    'bowercopy:dev',
    'copy:images',
    'webfont',
    'concurrent:watch'
  ]);

  // Build the project and deploy to the FTP
  grunt.registerTask('deploy', [
    'bowercopy:dev',
    'copy:images',
    'webfont',
    'shell:sass_compile',
    'copy:dist',
    'cssmin',
    'svgmin',
    'clean',
    'uglify',
    'kraken',
    'copy:replacements',
    //'ftpush'
  ]);
  
};