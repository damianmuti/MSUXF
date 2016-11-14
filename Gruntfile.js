module.exports = function(grunt) {

  'use strict';

  // Load Grunt tasks declared in the package.json file
  require('load-grunt-tasks')(grunt);

  // Project settings
  var config = {
    // Folders for assets, development environment and production environment
    folder_dev: 'dev', // If this path gets changed, remember to update .gitignore with the proper path to ignore images and css
    folder_assets: 'assets',
    folder_doc: 'doc',

    // Local server info
    server_address: 'localhost',
    server_port: '1337',
    server_ui_port: '1338',
    server_doc_port: '1339',
    server_doc_ui_port: '1340'
  };

  // Configure Grunt
  grunt.initConfig({

    // Project settings
    config: config,

    /* ====================================================================================== */
    /* Development tasks                                                                      */
    /* ====================================================================================== */

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            '<%= config.folder_dev %>/css/*.css',
            '<%= config.folder_dev %>/img/*',
            '<%= config.folder_dev %>/js/*',
            '<%= config.folder_dev %>/*.html'
          ]
        },
        options: {
          watchTask: true,
          port: config.server_port,
          server: {
            baseDir: '<%= config.folder_dev %>/'
          },
          ui: {
            port:  config.server_ui_port
          }
        }
      },
      doc: {
        bsFiles: {
          src: '<%= config.folder_doc %>/index.html'
        },
        options: {
          watchTask: true,
          port: config.server_doc_port,
          server: {
            baseDir: '<%= config.folder_doc %>'
          },
          ui: {
            port:  config.server_doc_ui_port
          }
        }
      }
    },

    // Templating engine
    processhtml: {
      dist: {
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
        map: {
          prev: '<%= config.folder_dev %>/css/'
        },
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions', 'last 3 iOS versions', 'iOS 7']
          }),
          require("css-mqpacker")()
        ]
      },
      dist: {
        src: '<%= config.folder_dev %>/css/*.css'
      }
    },

    // Run cleanCSS through grunt-cssmin
    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files: {
          '<%= config.folder_dev %>/css/styles.css': '<%= config.folder_dev %>/css/styles.css'
        }
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
          template: 'grunt-icontemplate.css',
          htmlDemo: false,
          skip: false, // Set this variable to false to create the icon font. If /icons folder is empty, leave this variable as is
          templateOptions: {
            baseClass: 'ms-icon',
            classPrefix: 'icon-',
            fontPath: '../fonts/'
          }
        }
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
          '<%= config.folder_assets %>/styles/libs/jeet': 'jeet.gs/scss/index.scss',
          '<%= config.folder_assets %>/styles/libs/normalize': 'normalize-scss',
          '<%= config.folder_assets %>/styles/libs/sassy-cast': 'sassy-cast/dist',
          '<%= config.folder_assets %>/js/vendor/jquery.min.js': 'jquery-latest/dist/jquery.min.js'
        }
      }
    },

    imagemin: { // Task
      dynamic: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true, // Enable dynamic expansion
          cwd: '<%= config.folder_assets %>/img/', // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,svg}'], // Actual patterns to match
          dest: '<%= config.folder_dev %>/img/' // Destination path prefix
        }]
      },
    },

    // Uglify JS
    uglify: {
      options: {
        sourceMap: true,
        sourceMapName: '<%= config.folder_dev %>/js/app.map'
      },
      files: {
        src: [
          '<%= config.folder_assets %>/js/vendor/*.js',
          '<%= config.folder_assets %>/js/*.js'
        ],
        dest: '<%= config.folder_dev %>/js/app.js'
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
        src: '<%= config.folder_dev %>',
        dest: '',
        concurrency: 4,
        progress: true
      }
    },

    // Generate Sass Documentation
    sassdoc: {
      default: {
        src: 'assets/styles/',
        options: {
          dest: '<%= config.folder_doc %>',
          exclude: ['assets/styles/libs/*'],
          display: {
            watermark: false
          },
          "groups": {
            "undefined": "General"
          },
        }
      }
    },

    compress: {
      build: {
        options: {
          archive: 'deploy--' + grunt.template.today('yyyy-mm-dd-HH:mm:ss') + '.zip',
          mode: 'zip'
        },
        files: [
          { src: '<%= config.folder_dev %>' }
        ]
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: ['watch:scss', 'watch:js', 'watch:templates', 'watch:images', 'watch:icons']
    },

    // grunt-watch monitors the projects files and execute actions when a file changes
    watch: {
      scss: {
        files: ['<%= config.folder_assets %>/styles/**'],
        tasks: ['sass:ui', 'postcss', 'cssmin'],
        options: {
          spawn: false,
          livereload: false
        }
      },
      sassdoc: {
        files: ['<%= config.folder_assets %>/styles/**'],
        tasks: ['sassdoc'],
        options: {
          spawn: false,
          livereload: false
        }
      },
      js: {
        files: '<%= config.folder_assets %>/js/**',
        tasks: ['uglify'],
        options: {
          spawn: false,
          livereload: false
        }
      },
      templates: {
        files: ['<%= config.folder_assets %>/templates/*.*'],
        tasks: ['processhtml'],
        options: {
          livereload: false
        }
      },
      images: {
        files: '<%= config.folder_assets %>/img/**.*',
        tasks: ['imagemin'],
        options: {
          livereload: false
        }
      },
      icons: {
        files: '<%= config.folder_assets %>/icons/*.*',
        tasks: ['webfont'],
        options: {
          livereload: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-sassdoc');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  /* ====================================================================================== */
  /* Tasks @registration                                                                    */
  /* ====================================================================================== */

  grunt.registerTask('run', [
    'bowercopy',
    'imagemin',
    'uglify',
    'webfont',
    'sass:ui',
    'processhtml',
    'browserSync:dev',
    'concurrent:dev'
  ]);

  grunt.registerTask('doc', [
    'sassdoc',
    'browserSync:doc',
    'watch:sassdoc'
  ]);

  grunt.registerTask('zip', [
    'compress'
  ]);
};
