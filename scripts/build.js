const webpack = require('webpack');
const rimraf = require('rimraf');

const webpackConfig = require('../config/webpack-config')(process.env.NODE_ENV || 'production');

const paths = require('../config/paths');
const { logMessage, compilerPromise, findCompiler } = require('./utils');

const build = async () => {
  rimraf.sync(paths.build);

  const [useLazyConfig] = webpackConfig;
  const multiCompiler = webpack([useLazyConfig]);

  const getCompiler = findCompiler(multiCompiler);

  const useLazyCompiler = getCompiler('useLazy');

  const useLazyPromise = compilerPromise('useLazy', useLazyCompiler);

  useLazyCompiler.watch({}, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      // eslint-disable-next-line no-console
      console.log(stats.toString(useLazyConfig.stats));
      // eslint-disable-next-line no-useless-return
      return;
    }
  });

  // wait until client and blocks is compiled
  try {
    await useLazyPromise;
    logMessage('Done!', 'info');
  } catch (error) {
    logMessage(error, 'error');
  }
};

build();
