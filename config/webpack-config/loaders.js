const jsRegex = /\.(js|jsx|mjs|ts|tsx)$/;

const eslintLoader = {
  enforce: 'pre',
  test: jsRegex,
  loader: 'eslint-loader',
  exclude: /node_modules/,
};

const tsLoader = {
  test: jsRegex,
  exclude: /node_modules/,
  loader: require.resolve('ts-loader'),
};

const useLazyLoaders = [
  eslintLoader,
  tsLoader,
];

module.exports = {
  useLazyLoaders,
};
