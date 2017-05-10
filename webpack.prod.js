const webpack = require('webpack');
const merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

module.exports = env => {
  return merge(CommonConfig, {
    plugins: [
      new webpack.optimize.UglifyJsPlugin()
    ]
  });
};
