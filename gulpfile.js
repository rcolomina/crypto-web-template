const { src, dest, series, parallel, watch } = require("gulp");

// markup
const nunjucks = require("gulp-nunjucks");
const htmlmin = require("gulp-htmlmin");

// stylesheets
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const postcss = require("gulp-postcss");

// utils
const gulpIf = require("gulp-if");
const { join } = require("path");
const flatten = require("gulp-flatten");
const rimraf = require("rimraf");
const browserSync = require("browser-sync").create();

const [DEV, PROD] = ["development", "production"];
const { NODE_ENV = DEV } = process.env;
const IS_PROD = NODE_ENV === PROD;

const SRC = "src";
const DIST = "dist";

function processMarkup() {
  return src(join(SRC, "pages", "*", "*.html"))
    .pipe(nunjucks.compile())
    .pipe(gulpIf(IS_PROD, htmlmin({ collapseWhitespace: true })))
    .pipe(flatten())
    .pipe(dest(DIST))
    .pipe(browserSync.stream());
}

function processStyles() {
  return src(join(SRC, "pages", "*", "*.scss"))
    .pipe(
      sass({ includePaths: [SRC, "node_modules"] }).on("error", sass.logError)
    )
    .pipe(postcss())
    .pipe(flatten())
    .pipe(dest(DIST))
    .pipe(browserSync.stream());
}

function startBrowserSync() {
  browserSync.init({
    server: {
      baseDir: DIST
    },
    notify: false,
    open: false,
    online: false,
    ui: false
  });
}

function watchFiles() {
  watch(join(SRC, "**", "*.html"), processMarkup);
  watch(join(SRC, "**", "*.scss"), processStyles);
}

function cleanUp(cb) {
  rimraf.sync(DIST);
  cb();
}

switch (NODE_ENV) {
  case DEV:
    exports.default = series(
      cleanUp,
      parallel(watchFiles, startBrowserSync, processMarkup, processStyles)
    );
    break;

  case PROD:
    exports.default = series(cleanUp, parallel(processMarkup, processStyles));
    break;
}
