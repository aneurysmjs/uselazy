const paths = require('./config/paths');

module.exports = {
  verbose: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,mjs,ts,tsx}'],
  setupFiles: [
    '<rootDir>/node_modules/regenerator-runtime/runtime',
  ],
  // A list of paths to modules that run some code to configure
  // or set up the testing framework before each test.
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs,ts,tsx}',
    '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs,ts,tsx}',
  ],
  testEnvironment: 'node',
  testURL: 'http://localhost',
  modulePaths: ['src'],
  moduleNameMapper: {
    '^~[/](.+)': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'],
  moduleDirectories: paths.resolveModules,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node', 'mjs'],
};
