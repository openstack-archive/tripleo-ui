require('es6-promise').polyfill(); // https://github.com/webpack/css-loader/issues/144

module.exports = {
  devtool: 'inline-source-map',
  entry: __dirname + '/src/js/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'tripleo_ui.js',
    sourceMapFilename: 'tripleo_ui.js.map'
  },
  module: {
    loaders: [
      // Javascript
      {
        test: /\.js$/,
        include: /src/,
        exclude: /src\/js\/workers/,
        loader: 'babel'
      },

      // Shared Workers
      {
        test: /\.js$/,
        include: /src\/js\/workers/,
        loader: 'shared-worker!babel'
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
        loader: 'url',
        query: {
          limit: 8192,
          mimetype: 'application/font-woff',
          name: '[name].[ext]'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 8192,
          mimetype: 'application/octet-stream',
          name: '[name].[ext]'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
        query: { name: '[name].[ext]' }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 8192,
          mimetype: 'image/svg+xml',
          name: '[name].[ext]'
        }
      },

      // Plain CSS files
      {
        test: /\.css$/,
        loader: 'style!css'
      },

      // Less
      {
        test: /\.less$/,
        loader: 'style!css!less?sourceMap'
      }
    ]
  },
  devServer: {
    contentBase: './dist',
    port: 3000,
    colors: true,
    historyApiFallback: true,
    inline: true
  }
};
