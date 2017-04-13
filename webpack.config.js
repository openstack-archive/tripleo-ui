require('es6-promise').polyfill(); // https://github.com/webpack/css-loader/issues/144
var HtmlWebpackPlugin = require('html-webpack-plugin');
var I18nPlugin = require('./src/js/plugins/i18n');

module.exports = {
  devtool: 'inline-source-map',
  entry: __dirname + '/src/js/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'tripleo_ui.js',
    sourceMapFilename: 'tripleo_ui.js.map'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
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
        include: /src/,
        exclude: /src\/js\/workers/,
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
        use: [
          'style-loader',
          'css-loader'
        ]
      },

      // Less
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader?sourceMap'
        ]
      },

      {
        loader: __dirname + '/src/js/loaders/version.js',
        test: /src\/js\/index.js$/
      }

    ]
  },
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    port: 3000,
    stats: {
      colors: true
    },
    historyApiFallback: true,
    inline: true
  }
};
