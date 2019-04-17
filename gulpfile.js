const { dest, series, src, watch } = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const header = require("gulp-header");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const pump = require("pump");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("gulp-cssnano");
const del = require("del");
const package = require("./package.json");

const banner = `/*!
 *
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause

 * ${package.name} - @version ${package.version}
 */

`;

// Development server
function watchFiles(callback) {
  browserSync.init({
    server: {
      baseDir: "./docs"
    }
  });
  watch("src/sass/**/*.scss", compileSass);
  watch("src/js/**/*.js", compileJS);
  watch("src/index.html", compileHTML);

  callback();
}

// Development Server -- No Browser
function headless(callback) {
  browserSync.init({
    server: {
      baseDir: "./docs"
    },
    open: false
  });
  watch("src/sass/**/*.scss",{ ignoreInitial: false }, compileSass);
  watch("src/js/**/*.js", { ignoreInitial: false }, compileJS);
  watch("src/index.html", { ignoreInitial: false }, compileHTML);

  callback();
}

function compileHTML() {
  return src("src/index.html")
    .pipe(dest("docs/"))
    .pipe(browserSync.stream());
}

function compileSass() {
  return src("src/sass/**/*.scss")
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest("docs/css/"))
    .pipe(browserSync.stream());
}

function releaseSass() {
  return src("src/sass/**/*.scss")
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest("dist/css/"));
}

function cleanCSS() {
  return del(["dist/css/**/*"]);
}

function minifyCSS() {
  return src("dist/css/" + package.name + ".css")
    .pipe(cssnano())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(dest("dist/css/"));
}

function prefixCSS() {
  return src("dist/css/" + package.name + ".css")
    .pipe(postcss([autoprefixer({ browsers: ["last 2 versions"] })]))
    .pipe(dest("dist/css/"));
}

function headerCSS(callback) {
  src("dist/css/" + package.name + ".css")
    .pipe(header(banner, { package: package }))
    .pipe(dest("dist/css/"));

  src("dist/css/" + package.name + ".min.css")
    .pipe(header(banner, { package: package }))
    .pipe(dest("dist/css/"));

  callback();
}

// This task is used to watch during development only.
function compileJS() {
  return src("src/js/**/*.js")
    .pipe(dest("docs/js/"))
    .pipe(browserSync.stream());
}

function cleanJS() {
  return del(["dist/js/**/*"]);
}

function copyJS() {
  return src("src/js/**/*.js").pipe(dest("dist/js/"));
}

function copyJS() {
  return src("src/js/**/*.js").pipe(dest("dist/js/"));
}

function minifyJS(done) {
  pump(
    [
      src("dist/js/" + package.name + ".js"),
      uglify(),
      rename({ suffix: ".min" }),
      dest("dist/js")
    ],
    done
  );
}

function headerJS(callback) {
  src("dist/js/" + package.name + ".js")
    .pipe(header(banner, { package: package }))
    .pipe(dest("dist/js/"));

  src("dist/js/" + package.name + ".min.js")
    .pipe(header(banner, { package: package }))
    .pipe(dest("dist/js/"));

  callback();
}

// Deletes everything in the dist/js and dist/css folders
exports.clean = series(
  cleanCSS,
  cleanJS
);


// Run release tasks
exports.release = series(
  cleanCSS,
  releaseSass,
  prefixCSS,
  minifyCSS,
  headerCSS,
  cleanJS,
  copyJS,
  minifyJS,
  headerJS
);

// Headless dev server
exports.headless = headless;

exports.buildDocs = series(compileHTML, compileSass, compileJS);

// Default dev server
exports.default = series(compileHTML, compileSass, compileJS, watchFiles);
