const webpack = require('webpack');
const merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

module.exports = env => {
  return merge(CommonConfig, {
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      host: '0.0.0.0',
      port: 3000,
      stats: {
        colors: true
      },
      historyApiFallback: true,
      inline: true
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  });
};
