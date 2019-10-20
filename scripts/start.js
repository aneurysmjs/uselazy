const webpack = require('webpack');
const nodemon = require('nodemon');
const rimraf = require('rimraf');

const webpackConfig = require('../config/webpack-config')(process.env.NODE_ENV || 'development');
const paths = require('../config/paths');
const { logMessage, compilerPromise, findCompiler } = require('./utils');

const start = async () => {
  rimraf.sync(paths.build);

  const [useLazyConfig] = webpackConfig;

  const multiCompiler = webpack([useLazyConfig]);

  const getCompiler = findCompiler(multiCompiler);

  const useLazyCompiler = getCompiler('useLazy');

  const useLazyPromise = compilerPromise('useLazy', useLazyCompiler);

  const watchOptions = {
    // poll: true,
    ignored: /node_modules/,
    stats: {
      cached: false,
      cachedAssets: false,
      chunks: false,
      chunkModules: false,
      colors: true,
      hash: false,
      modules: false,
      reasons: false,
      timings: true,
      version: false,
    },
  };

  useLazyCompiler.watch(watchOptions, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      // eslint-disable-next-line no-console
      console.log(stats.toString(useLazyConfig.stats));
      return;
    }

    if (error) {
      logMessage(error, 'error');
    }

    if (stats.hasErrors()) {
      const info = stats.toJson();
      const errors = info.errors[0].split('\n');
      logMessage(errors[0], 'error');
      logMessage(errors[1], 'error');
      logMessage(errors[2], 'error');
    }
  });

  // wait until client and blocks is compiled
  try {
    await useLazyPromise;
  } catch (error) {
    logMessage(error, 'error');
  }

  const script = nodemon({
    script: `${paths.build}/useLazy.js`,
    ignore: ['src', 'scripts', 'config', './*.*'],
  });

  script.on('restart', () => {
    logMessage('useLazy has been restarted.', 'warning');
  });

  script.on('quit', () => {
    // eslint-disable-next-line no-console
    console.log('Process ended');
    process.exit();
  });

  script.on('error', () => {
    logMessage('An error occured. Exiting', 'error');
    process.exit(1);
  });
};

start();
