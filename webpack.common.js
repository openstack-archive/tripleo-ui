/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

require('es6-promise').polyfill(); // https://github.com/webpack/css-loader/issues/144
const HtmlWebpackPlugin = require('html-webpack-plugin');
const I18nPlugin = require('./src/js/plugins/i18n');
const path = require('path');

module.exports = {
  entry: __dirname + '/src/js/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'tripleo_ui.js',
    sourceMapFilename: 'tripleo_ui.js.map'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/img/owl.png'
    }),
    new I18nPlugin({
      localePath: 'i18n/locales'
    })
  ],
  module: {
    rules: [
      // Javascript
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader'
      },

      // Images
      {
        test: /\.(png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192, // inline base64 URLs for <=8k images, direct URLs for the rest
          name: '[name].[ext]'
        }
      },

      // Fonts and svg images
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          mimetype: 'application/font-woff',
          name: '[name].[ext]'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          mimetype: 'application/octet-stream',
          name: '[name].[ext]'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        query: { name: '[name].[ext]' }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          mimetype: 'image/svg+xml',
          name: '[name].[ext]'
        }
      },

      // Plain CSS files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      // Less
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader?sourceMap']
      },

      {
        loader: __dirname + '/src/js/loaders/version.js',
        test: /src\/js\/index.js$/
      }
    ]
  }
};
