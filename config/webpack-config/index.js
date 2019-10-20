module.exports = (env = 'production') => {
  if (env === 'development' || env === 'dev') {
    process.env.NODE_ENV = 'development';
    // eslint-disable-next-line global-require
    return [require('./useLazy/useLazy.dev')];
  }
  process.env.NODE_ENV = 'production';
  // eslint-disable-next-line global-require
  return [require('./useLazy/useLazy.prod')];
};
