const path = require('path');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    zlib: require.resolve('browserify-zlib'),
    url: require.resolve('url/'),
    assert: require.resolve('assert/'),
    stream: require.resolve('stream-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
  };

  return config;
};
