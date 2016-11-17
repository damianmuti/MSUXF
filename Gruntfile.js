module.exports = function(grunt) {

  'use strict';

  // Load Grunt tasks declared in the package.json file
  require('load-grunt-tasks')(grunt);

  // Project settings
  var config = {
    // Folders for assets, development environment and production environment
    folderDev: 'dev', // If this path gets changed, remember to update .gitignore with the proper path to ignore images and css
    folderAssets: 'assets',
    folderDoc: 'documentation',
    folderDist: 'dist',

    // Local server info
    serverPort: '1337',
    serverUiPort: '1338',
    serverDocPort: '1339',
    serverDocUiPort: '1340'
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
            '<%= config.folderDev %>/css/*.css',
            '<%= config.folderDev %>/img/*',
            '<%= config.folderDev %>/js/*',
            '<%= config.folderDev %>/*.html'
          ]
        },
        options: {
          watchTask: true,
          port: config.serverPort,
          server: {
            baseDir: '<%= config.folderDev %>/'
          },
          ui: {
            port: config.serverUiPort
          }
        }
      },
      doc: {
        bsFiles: {
          src: '<%= config.folderDoc %>/index.html'
        },
        options: {
          watchTask: true,
          port: config.serverDocPort,
          server: {
            baseDir: '<%= config.folderDoc %>'
          },
          ui: {
            port: config.serverDocUiPort
          }
        }
      }
    },

    // Templating engine
    processhtml: {
      dev: {
        options: {
          process: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.folderAssets %>/templates/',
          src: ['*.html'],
          dest: './<%= config.folderDev %>',
          ext: '.html'
        }]
      },
      dist: {
        options: {
          process: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.folderAssets %>/templates/',
          src: ['*.html'],
          dest: './<%= config.folderDist %>',
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
          '<%= config.folderDev %>/css/styles.css': '<%= config.folderAssets %>/styles/styles.scss'
        }
      },
    },

    // Run autoprefixer after Sass is compiled
    postcss: {
      options: {
        map: {
          prev: '<%= config.folderDev %>/css/'
        },
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions', 'last 3 iOS versions', 'iOS 7']
          }),
          require("css-mqpacker")()
        ]
      },
      dist: {
        src: '<%= config.folderDev %>/css/*.css'
      }
    },

    // Run cleanCSS through grunt-cssmin
    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files: {
          '<%= config.folderDev %>/css/styles.css': '<%= config.folderDev %>/css/styles.css'
        }
      }
    },

    // Create an icon font from SVG files insode /icons folder
    webfont: {
      icons: {
        src: '<%= config.folderAssets %>/icons/*.svg',
        dest: '<%= config.folderDev %>/fonts',
        destCss: '<%= config.folderAssets %>/styles/libs/iconfont',
        options: {
          font: 'icon-font',
          hashes: false,
          engine: 'node',
          stylesheet: 'scss',
          relativeFontPath: '../fonts/',
          // syntax: 'bootstrap',
          template: '<%= config.folderAssets %>/styles/libs/iconfont/grunt-icontemplate.css',
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
          '<%= config.folderAssets %>/styles/libs/jeet': 'jeet.gs/scss/index.scss',
          '<%= config.folderAssets %>/styles/libs/normalize': 'normalize-scss',
          '<%= config.folderAssets %>/styles/libs/sassy-cast': 'sassy-cast/dist',
          '<%= config.folderAssets %>/js/vendor/jquery.min.js': 'jquery-latest/dist/jquery.min.js'
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
          cwd: '<%= config.folderAssets %>/img/', // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,svg}'], // Actual patterns to match
          dest: '<%= config.folderDist %>/img/' // Destination path prefix
        }]
      },
    },

    // Kraken image optimization task, set up if needed
    kraken: {
      options: {
        key: 'kraken-api-key-here',
        secret: 'kraken-api-secret-here',
        lossy: true
      },

      dynamic: {
        files: [{
          expand: true, // Enable dynamic expansion
          cwd: '<%= config.folderAssets %>/img/', // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,svg}'], // Actual patterns to match
          dest: '<%= config.folderDist %>/img/' // Destination path prefix
        }]
      }
    },

    // Uglify JS
    uglify: {
      options: {
        sourceMap: true,
        sourceMapName: '<%= config.folderDev %>/js/app.map'
      },
      files: {
        src: [
          '<%= config.folderAssets %>/js/vendor/*.js',
          '<%= config.folderAssets %>/js/*.js'
        ],
        dest: '<%= config.folderDist %>/js/app.js'
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
        src: '<%= config.folderDev %>',
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
          dest: '<%= config.folderDoc %>',
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
          archive: 'deploy--' + grunt.template.today('yyyy-mm-dd_HH-mm-ss') + '.zip',
          mode: 'zip'
        },
        files: [
          { src: '<%= config.folderDist %>' }
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
        files: ['<%= config.folderAssets %>/styles/**'],
        tasks: ['sass:ui', 'postcss', 'cssmin'],
        options: {
          spawn: false,
          livereload: false
        }
      },
      sassdoc: {
        files: ['<%= config.folderAssets %>/styles/**'],
        tasks: ['sassdoc'],
        options: {
          spawn: false,
          livereload: false
        }
      },
      js: {
        files: '<%= config.folderAssets %>/js/**',
        tasks: ['copy:js'],
        options: {
          spawn: false,
          livereload: false
        }
      },
      templates: {
        files: ['<%= config.folderAssets %>/templates/*.*'],
        tasks: ['processhtml:dev'],
        options: {
          livereload: false
        }
      },
      images: {
        files: '<%= config.folderAssets %>/img/**.*',
        tasks: ['copy:img'],
        options: {
          livereload: false
        }
      },
      icons: {
        files: '<%= config.folderAssets %>/icons/*.*',
        tasks: ['webfont'],
        options: {
          livereload: false
        }
      }
    },

    copy: {
      js: {
        expand: true,
        cwd: '<%= config.folderAssets %>/js',
        src: '**',
        dest: '<%= config.folderDev %>/js/'
      },
      img: {
        expand: true,
        flatten: true,
        src: ['<%= config.folderAssets %>/img/**'],
        dest: '<%= config.folderDev %>/img/',
        filter: 'isFile'
      },
      css: {
        expand: true,
        flatten: true,
        src: ['<%= config.folderDev %>/css/**'],
        dest: '<%= config.folderDist %>/css/',
        filter: 'isFile'
      },
      fonts: {
        expand: true,
        flatten: true,
        src: ['<%= config.folderDev %>/fonts/**'],
        dest: '<%= config.folderDist %>/fonts/',
        filter: 'isFile'
      },
      html: {
        expand: true,
        flatten: true,
        src: ['<%= config.folderDev %>/*.html'],
        dest: '<%= config.folderDist %>/',
        filter: 'isFile'
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
  grunt.loadNpmTasks('grunt-contrib-kraken');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');

  /* ====================================================================================== */
  /* Tasks @registration                                                                    */
  /* ====================================================================================== */

  grunt.registerTask('run', [
    'doc',
    'bowercopy',
    'copy:img',
    'copy:js',
    'webfont',
    'sass:ui',
    'processhtml:dev',
    'browserSync:dev',
    'concurrent:dev'
  ]);

  grunt.registerTask('doc', [
    'sassdoc'
  ]);

  grunt.registerTask('doc:watch', [
    'sassdoc',
    'browserSync:doc',
    'watch:sassdoc'
  ]);

  grunt.registerTask('dist', [
    'bowercopy',
    'copy:img',
    'copy:js',
    'webfont',
    'sass:ui',
    'processhtml:dist',
    'copy:css',
    'copy:html',
    'copy:fonts',
    'imagemin',
    'uglify'
  ]);

  grunt.registerTask('dist:zip', [
    'dist',
    'compress'
  ]);
};
