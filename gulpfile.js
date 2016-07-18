var fs = require('fs');
var gulp = require('gulp');

var browserSync = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback');
var less = require('gulp-less');
// var rename = require('gulp-rename');
var shell = require('gulp-shell');
// var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var tempStorageWorkerConfig = require('./tempstorageworker.webpack.config.js');

gulp.task('webpack-app', ['webpack-tempstorage-worker'], function() {
  return gulp.src('./src/js/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['webpack-app', 'less', 'fonts', 'images'], function(){
  browserSync.init({
    open: false,
    server: {
      baseDir: './dist',
      middleware: [ historyApiFallback() ]
    }
  });

  gulp.watch('src/less/**/*.less', ['less']);
  // Re-build app and run tests on app change.
  gulp.watch('src/js/**/*.js', ['webpack-app', 'test-run']);
  // Run tests on test change.
  gulp.watch('src/__tests__/**/*.js', ['test-run']);
  gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('less', function () {
  return gulp.src('./src/less/base.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  var bootstrapFonts = 'node_modules/bootstrap/fonts/*';
  var patternflyFonts = 'node_modules/patternfly/dist/fonts/*';
  var fontAwesomeFonts = 'node_modules/patternfly/components/font-awesome/fonts/*';
  return gulp.src([bootstrapFonts, patternflyFonts, fontAwesomeFonts])
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('images', function() {
  var imagesPath = 'src/img/*';
  var patternFlyImagesPath = 'node_modules/patternfly/dist/img/*';
  return gulp.src([patternFlyImagesPath, imagesPath])
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('webpack-tempstorage-worker', function() {
  return gulp.src('./src/js/workers/TempStorageWorker.js')
    .pipe(webpack(tempStorageWorkerConfig))
    .pipe(gulp.dest('./dist/js'));
});

// Start test server, run tests once, then quit.
gulp.task('test', shell.task('karma start --single-run'));

// Start test server, run tests, keep server running..
gulp.task('test-start', shell.task('karma start'));

// Do a single test run (expects Karma server to be running).
gulp.task('test-run', shell.task('karma run'));

gulp.task('default', [ 'serve', 'test-start' ], function() {});
