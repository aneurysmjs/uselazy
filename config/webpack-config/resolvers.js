
const paths = require('../paths');

module.exports = {
  extensions: ['.js', '.mjs', '.jsx', '.ts' , '.tsx'],
  modules: paths.resolveModules,
  alias: {
    '~': paths.src,
  },
};
