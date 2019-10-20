const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

const baseConfig = require('./useLazy.base');

const config = {
  ...baseConfig,
  plugins: [
    new WriteFileWebpackPlugin(),
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
  ],
  mode: 'development',
  performance: {
    hints: false,
  },
};

module.exports = config;
