// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const { useLazyLoaders } = require('../loaders');
const paths = require('../../paths');
const resolvers = require('../resolvers');
const plugins = require('../plugins');

module.exports = {
  mode: 'development',
  name: 'useLazy',
  target: 'node',
  entry: {
    useLazy: [path.resolve(paths.src, 'index.tsx')],
  },
  externals: [
    nodeExternals(),
  ],
  output: {
    path: paths.build,
    filename: 'useLazy.js',
    // publicPath: paths.publicPath,
  },
  module: {
    rules: useLazyLoaders,
  },
  resolve: {
    ...resolvers,
  },
  plugins: [
    ...plugins.shared,
    ...plugins.useLazyPlugins,
  ],
  stats: {
    colors: true,
  },
};
