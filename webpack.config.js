module.exports = {
  devtool: 'source-map',
  output: {
    filename: 'tripleo_ui.js',
    sourceMapFilename: '../js/tripleo_ui.js.map'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /src\/js\/workers/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-1', 'react']
        }
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
