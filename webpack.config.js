var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    index: './index.ts',
    test: './test/test.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: {
    vue: 'vue',
    chai: 'chai',
  },
  module: {
    rules: [
      {test: /\.ts$/, use: 'ts-loader'}
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  target: 'node'
}
