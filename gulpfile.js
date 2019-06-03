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
const [IS_DEV, IS_PROD] = [NODE_ENV === DEV, NODE_ENV === PROD];

const SRC = "src";
const DIST = "dist";

function processMarkup() {
  return src(join(SRC, "*.html"))
    .pipe(nunjucks.compile())
    .pipe(gulpIf(IS_PROD, htmlmin({ collapseWhitespace: true })))
    .pipe(flatten())
    .pipe(dest(DIST))
    .pipe(gulpIf(IS_DEV, browserSync.stream()));
}

function processStyles() {
  return src(join(SRC, "*.scss"))
    .pipe(
      sass({ includePaths: [SRC, "node_modules"] }).on("error", sass.logError)
    )
    .pipe(postcss())
    .pipe(flatten())
    .pipe(dest(DIST))
    .pipe(gulpIf(IS_DEV, browserSync.stream()));
}

function serveFiles() {
  browserSync.init({
    server: {
      baseDir: DIST
    },
    notify: false,
    open: false,
    online: false,
    ui: false
  });

  watch(SRC + "/**/*.html", processMarkup);
  watch(SRC + "/**/*.scss", processStyles);
}

function cleanUp(cb) {
  rimraf.sync(DIST);
  cb();
}

function processVendor() {
  return src("node_modules/normalize.css/normalize.css")
    .pipe(postcss())
    .pipe(flatten())
    .pipe(dest(join(DIST, "vendor")));
}

function processAssets() {
  return src(join(SRC, "assets", "**", "*.*"), {
    base: join(SRC, "assets")
  }).pipe(dest(join(DIST, "assets")));
}

const coreAsyncTasks = [
  processMarkup,
  processStyles,
  processVendor,
  processAssets
];

if (IS_DEV) {
  exports.default = series(cleanUp, parallel(serveFiles, ...coreAsyncTasks));
}

if (IS_PROD) {
  exports.default = series(cleanUp, parallel(...coreAsyncTasks));
}
