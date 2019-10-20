const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const paths = {
  build: resolveApp('build'),
  dotenv: resolveApp('.env'),
  src: resolveApp('src'),
};

paths.resolveModules = [
  paths.src,
  'node_modules',
];

module.exports = paths;
