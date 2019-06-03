const { NODE_ENV } = process.env;

const config = {
  plugins: {
    autoprefixer: {}
  }
};

if (NODE_ENV === "production") {
  config.plugins.cssnano = {};
}

module.exports = config;
