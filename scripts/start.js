const webpack = require('webpack');
const express = require('express');
const chalk = require('chalk');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../config/webpack-config')(process.env.NODE_ENV || 'development');
const paths = require('../config/paths');
const {
  logMessage,
  makeCompilerPromise,
  findCompiler,
} = require('./utils');

const app = express();

const PORT = process.env.PORT || 8500;

const DEVSERVER_HOST = process.env.DEVSERVER_HOST || 'http://localhost';

(async () => {
  const [useLazyConfig] = webpackConfig;
  useLazyConfig.entry.useLazy = [
    `webpack-hot-middleware/client?path=${DEVSERVER_HOST}:${PORT}/__webpack_hmr`,
    ...useLazyConfig.entry.useLazy,
  ];

  useLazyConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
  useLazyConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';

  const webpackCompiler = webpack([useLazyConfig]);
  const clientCompiler = findCompiler(webpackCompiler)('useLazy');
  const [clientPromise] = makeCompilerPromise([clientCompiler]);

  const watchOptions = {
    ignored: /node_modules/,
    stats: useLazyConfig.stats,
  };

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    return next();
  });

  app.use(
    webpackDevMiddleware(clientCompiler, {
      // publicPath: useLazyConfig.output.publicPath,
      stats: useLazyConfig.stats,
      watchOptions,
    }),
  );

  app.use(webpackHotMiddleware(clientCompiler));

  app.use('*', express.static(paths.dist));

  try {
    await clientPromise;

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `[${new Date().toISOString()}]`,
        chalk.blue(
          `App is running: ${process.env.HOST || 'http://localhost'}:${process.env.PORT || 8500}`,
        ),
      );
    });
  } catch (error) {
    logMessage(error, 'error');
  }
})();
