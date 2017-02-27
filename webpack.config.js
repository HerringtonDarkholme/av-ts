var path = require('path')

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
  target: 'node'
}
