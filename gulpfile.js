const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const header = require('gulp-header');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const pump = require('pump');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const del = require('del');
const package = require('./package.json');

const banner = `/*!
 *
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause

 * ${package.name} - @version ${package.version}
 */

`;

// Development server
gulp.task('browser-sync', function (callback) {
  browserSync.init({
    server: {
      baseDir: "./docs"
    }
  });

  gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/**/*.js', gulp.series('js'));
  gulp.watch('src/index.html', gulp.series('html'));

  callback();
});

gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('docs/'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest('docs/css/'))
    .pipe(browserSync.stream());
});

gulp.task('sass:release', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('css:clean', function () {
  return del(['dist/css/**/*']);
});

gulp.task('css:minify', function () {
  return gulp.src('dist/css/' + package.name + '.css')
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('css:prefix', function () {
  return gulp.src('dist/css/' + package.name + '.css')
    .pipe(postcss([autoprefixer({ browsers: ['last 2 versions'] })]))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('css:header', function (callback) {
  gulp.src('dist/css/' + package.name + '.css')
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest('dist/css/'));

  gulp.src('dist/css/' + package.name + '.min.css')
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest('dist/css/'));
  
  callback();
});

gulp.task('css:release', gulp.series('css:clean', 'sass:release', 'css:prefix', 'css:minify', 'css:header'));

// This task is used to watch durring development only.
gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('docs/js/'))
    .pipe(browserSync.stream());
});

gulp.task('js:clean', function () {
  return del(['dist/js/**/*']);
});

gulp.task('js:copy', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('js:minify', function (done) {
  pump([
    gulp.src('dist/js/' + package.name + '.js'),
    uglify(),
    rename({ suffix: '.min' }),
    gulp.dest('dist/js')
  ],
    done
  );
});

gulp.task('js:header', function (callback) {
  gulp.src('dist/js/' + package.name + '.js')
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest('dist/js/'));

  gulp.src('dist/js/' + package.name + '.min.js')
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest('dist/js/'));
    callback();
});

gulp.task('js:release', gulp.series('js:clean', 'js:copy', 'js:minify', 'js:header'));

// Deletes everything in the dist/js and dist/css folders
gulp.task('clean', gulp.series('css:clean', 'js:clean'));

// Run release tasks
gulp.task('release', gulp.series('css:release', 'js:release'));

// Default dev server
gulp.task('default', gulp.series('browser-sync'));