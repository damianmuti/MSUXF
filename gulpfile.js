// Require Gulp
var gulp = require('gulp'),
// Require Gulp-util plugin
gutil = require('gulp-util'),
// Require Gulp-sass plugin
sass = require('gulp-sass'),
// Require Sourcemaps
sourcemaps = require('gulp-sourcemaps'),
// Require Browser Sync for livereloading
browserSync = require('browser-sync').create(),
// Require Del to clean dev folder
del = require('del'),
// Require Process HTML
processHtml = require('gulp-processhtml'),
// Require iconfont generator plugin
iconfont = require('gulp-iconfont'),
iconfontCss = require('gulp-iconfont-css'),
// Require PostCSS autoprefixer
autoprefixer = require('gulp-autoprefixer');


// Sass tasks are divided for performance issues regarding dependencies
// Sass Build task definition, only ran once
gulp.task('sass:build', ['webfont'], function(){
  return gulp.src('assets/styles/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('dev/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
// Sass Watch task definition
gulp.task('sass', function(){
  return gulp.src('assets/styles/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('dev/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// Browser Sync task definition
gulp.task('browserSync', function() {
  return browserSync.init({
    server: {
      baseDir: 'dev'
    },
  });
});


// Process HTML task definition
gulp.task('processHtml', function () {
  return gulp.src('./*.html')
    .pipe(processHtml())
    .pipe(gulp.dest('dev'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// PostCSS autoprefixer task definition
gulp.task('autoprefixer', function () {
  return gulp.src('dev/styles.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dev/css'));
});


// Generate webfonts
var fontName = 'icon-font';

gulp.task('webfont:generate',function(){
  return gulp.src(['assets/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      fontPath: '../fonts/',
      path: 'gulp-icontemplate.css',
      targetPath: '_icon-font.scss'
    }))
    .pipe(iconfont({
      fontName: fontName,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg']
     }))
    .pipe(gulp.dest('dev/fonts'));
});

gulp.task('webfont:copy', ['webfont:generate'], function(){
  return gulp.src(['dev/fonts/_icon-font.scss'])
  .pipe(gulp.dest('assets/styles/libs/iconfont/'));
});

gulp.task('webfont', ['webfont:copy'], function(){
  return del(['dev/fonts/*.scss']);
});


// Delete dev folder for cleaning
gulp.task('clean', ['clean:styles', 'clean:fonts']);

gulp.task('clean:styles', function() {
  return del.sync('dev/css');
});

gulp.task('clean:fonts', function() {
  return del.sync(['dev/fonts', 'assets/styles/libs/iconfont']);
});


// Watch for changes
gulp.task('run', ['build', 'browserSync'], function (){
  gulp.watch('assets/styles/**/*.scss', ['sass']);
  gulp.watch('dev/css/*.css', ['autoprefixer']);
  gulp.watch('assets/templates/*.html', ['processHtml']);
  // Uncomment if want to watch for js changes
  // gulp.watch('app/js/**/*.js', browserSync.reload); 
});

// Define build task
gulp.task('build', ['sass:build' ,'autoprefixer', 'processHtml']);