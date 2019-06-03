const { resolve } = require("path");

const [DEV, PROD] = ["development", "production"];
const { NODE_ENV } = process.env;
const [IS_DEV, IS_PROD] = [NODE_ENV === DEV, NODE_ENV === PROD];

const SRC = resolve(__dirname, "src");
const DIST = resolve(__dirname, "dist");

module.exports = {
  mode: NODE_ENV,
  watch: IS_DEV,
  resolve: {
    alias: { "@": SRC }
  },
  entry: {
    index: resolve(SRC, "pages", "index", "index.js")
  },
  output: {
    path: DIST
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: SRC,
        use: "babel-loader"
      }
    ]
  },
  stats: {
    modules: false,
    chunks: false,
    children: false
  }
};
