module.exports = function (grunt) {

  'use strict';

  // Load Grunt tasks declared in the package.json file
  require('load-grunt-tasks')(grunt);

  // Project settings
  var config = {

    // Folders for assets, development environment and production environment
    folder_dev: 'dev', // If this path gets changed, remember to update .gitignore with the proper path to ignore images and css
    folder_build: 'build',
    folder_dist: 'dist',
    folder_assets: 'assets',

    // Local server info
    server_address: 'localhost',
    server_port: '1337'

  };


  // Configure Grunt
  grunt.initConfig({

    // Project settings
    config: config,

    /* ====================================================================================== */
    /* Development tasks                                                                      */
    /* ====================================================================================== */

    // Fire a small web server to serve the HTML project
    connect: {
      server: {
        options: {
          port: 1337,
          base: '<%= config.folder_dev %>/',
          hostname: '*',
          livereload: true,
          debug: true
        }
      }
    },


    // Templating engine
    processhtml: {
      dist:{
        options: {
          process: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.folder_assets %>/templates/',
          src: ['*.html'],
          dest: './<%= config.folder_dev %>',
          ext: '.html'
        }]
      }
    },


    // grunt-watch monitors the projects files and execute actions when a file changes
    watch: {
      options: {
        livereload: true
      },
      scss: {
        files: ['<%= config.folder_assets %>/styles/**'],
        tasks: [
          'sass:ui',
          'postcss'
        ],
        options: {
          spawn: false
        }
      },
      js: {
        files: '<%= config.folder_dev %>/js/**.*'
      },
      templates: {
        files: [
          '<%= config.folder_assets %>/templates/*.*'
        ],
        tasks: ['processhtml']
      },
      html: {
        files: [
          '<%= config.folder_dev %>/*.html'
        ]
      },
      images: {
        files: '<%= config.folder_assets %>/images/**.*',
        tasks: ['copy:images']
      },
      icons: {
        files: '<%= config.folder_assets %>/icons/*.*',
        tasks: ['webfont']
      }
    },


    // Run Sass compile
    sass: {
      options: {
        sourceMap: true,
        outputStyle: 'compressed'
      },

      ui: {
        files: {
          '<%= config.folder_dev %>/css/styles.css': '<%= config.folder_assets %>/styles/styles.scss'
        }
      },
    },


    // Run autoprefixer after Sass is compiled
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: ['last 2 versions']}),
          require('cssnano')() // minify the result
        ]
      },
      dist: {
        src: '<%= config.folder_dev %>/css/*.css'
      }
    },


    // Create an icon font from SVG files insode /icons folder
    webfont: {
      icons: {
        src: '<%= config.folder_assets %>/icons/*.svg',
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
        path: 'http://<%= config.server_address %>:<%= config.server_port %>'
      }
    },


    // Copy only the needed resources from Bower
    bowercopy: {
      options: {
        // Bower components folder will be removed afterwards
        clean: false
      },

      dev: {
        files: {
          '<%= config.folder_assets %>/styles/libs/normalize': 'normalize-scss',
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
      build: {
        expand: true,
        cwd: '<%= config.folder_dev %>',
        src: '**',
        dest: '<%= config.folder_build %>',
        filter: 'isFile',
      },
      deploy: {
        expand: true,
        cwd: '<%= config.folder_dev %>',
        src: '**',
        dest: '<%= config.folder_dist %>',
        filter: 'isFile',
      }
    },


    // Execute concurrent tasks in Grunt
    concurrent: {
      watch: {
        tasks: [
          'watch', // Watch if files change
          'sass:ui', // Run Sass
          'open' // Open the webserver URL in a browser
        ],

        options: {
          logConcurrentOutput: true,
          limit: 4 // Limit CPU cores usage to 4
        }
      }
    },


    // Uglify JS
    uglify: {
      options: {
        beautify: {
          width: 80,
          beautify: false
        }
      },
      deploy: {
        files: [{
          expand: true,
          cwd: '<%= config.folder_dist %>/js',
          src: '**/*.js',
          dest: '<%= config.folder_dist %>/js'
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: '<%= config.folder_build %>/js',
          src: '**/*.js',
          dest: '<%= config.folder_build %>/js'
        }]
      }
    },


    // Image compression
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


    // Push everything to FTP server
    'sftp-deploy': {
      build: {
        auth: {
          host: '',
          port: 22,
          authKey: 'key1' // Config credentials in .ftppass file
        },
        cache: 'sftpCache.json',
        src: '<%= config.folder_build %>',
        dest: '',
        concurrency: 4,
        progress: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-kraken');
  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-processhtml');



  /* ====================================================================================== */
  /* Tasks @registration                                                                    */
  /* ====================================================================================== */

  grunt.registerTask('run', [
    'connect:server',
    'bowercopy',
    'copy:images',
    'webfont',
    'processhtml',
    'concurrent:watch'
  ]);

  grunt.registerTask('build', [
    'bowercopy',
    'webfont',
    'processhtml',
    'sass',
    'copy:build',
    'copy:images',
    'uglify:build'
  ]);

  grunt.registerTask('deploy', [
    'bowercopy',
    'copy:images',
    'webfont',
    'processhtml',
    'sass',
    'copy:deploy',
    'uglify:deploy',
    'kraken',
    'sftp-deploy'
  ]);


};
