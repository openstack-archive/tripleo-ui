module.exports = {
  entry: __dirname + '/src/js/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'tripleo_ui.js',
    sourceMapFilename: 'tripleo_ui.js.map'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /src\/js\/workers/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        include: /src\/js\/workers/,
        loader: 'shared-worker!babel-loader'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192' // inline base64 URLs for <=8k images, direct URLs for the rest
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader?noquotes'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    colors: true,
    historyApiFallback: true,
    inline: true

  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
