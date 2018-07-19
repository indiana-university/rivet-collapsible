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
const runSequence = require('run-sequence');
const del = require('del');
const package = require('./package.json');

// Get the current year for copyright in the banner
const currentYear = new Date().getFullYear();

const banner = `/*!
 * ${package.name} - @version ${package.version}
 *
 * Copyright (c) ${currentYear}, The Trustees of Indiana University

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

`;

// Development server
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./docs"
    }
  });

  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/index.html', ['html']);
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

gulp.task('css:header', function () {
  gulp.src('dist/css/' + package.name + '.css')
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest('dist/css/'));

  gulp.src('dist/css/' + package.name + '.min.css')
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('css:release', function(done) {
  runSequence('css:clean', 'sass:release', 'css:prefix', 'css:minify', 'css:header')
});

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

gulp.task('js:header', function () {
  gulp.src('dist/js/' + package.name + '.js')
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest('dist/js/'));

  gulp.src('dist/js/' + package.name + '.min.js')
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('js:release', function(done) {
  runSequence('js:clean', 'js:copy', 'js:minify', 'js:header', done);
});

// Deletes everything in the dist/js and dist/css folders
gulp.task('clean', ['css:clean', 'js:clean']);

// Run release tasks
gulp.task('release', ['css:release', 'js:release']);

// Default dev server
gulp.task('default', ['browser-sync']);