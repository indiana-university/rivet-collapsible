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

// Create the string for the verion number banner.
const banner = `/*! ${package.name} - @version ${package.version}

* Copyright (c) ${currentYear} TheTrustees of Indiana University

* Licensed under the BSD 3-Clause License.

* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*   1.Redistributions of source code must retain the above copyright notice,
*   this list of conditions and the following disclaimer.
*   2.Redistributions in binary form must reproduce the above copyright notice,
*   this list of conditions and the following disclaimer in the documentation
*   and/or other materials provided with the distribution.
*   3.Neither the name of the copyright holder nor the names of its
*   contributors may be used to endorse or promote products derived from
*   this software without specific prior written permission.
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
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