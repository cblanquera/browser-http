const path = require('path');
module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: './src/browser.ts',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'browser-http.js',
    path: path.resolve(__dirname, 'dist')
  }
};