const webpackMerge = require('webpack-merge');

const loadPresets = require('./config/webpack-config/loadPresets');
const modeConfig = env => require(`./build-utils/webpack.${env.mode}.js`)(env);

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) =>
  webpackMerge(
    modeConfig({ mode }),
    loadPresets({ mode, presets })
  );