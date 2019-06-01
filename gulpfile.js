const { src, dest, series, parallel } = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const nunjucks = require("gulp-nunjucks");
const { join } = require("path");
const flatten = require("gulp-flatten");
const rimraf = require("rimraf");

const SRC = "src";
const DIST = "dist";

function cleanUp(cb) {
  rimraf.sync(DIST);
  cb();
}

function processMarkup() {
  return src(join(SRC, "pages", "*", "*.html"))
    .pipe(nunjucks.compile())
    .pipe(flatten())
    .pipe(dest(DIST));
}

function processStyles() {
  return src(join(SRC, "pages", "*", "*.scss"))
    .pipe(sass({ includePaths: [SRC] }).on("error", sass.logError))
    .pipe(flatten())
    .pipe(dest(DIST));
}

exports.default = series(cleanUp, parallel(processMarkup, processStyles));
