module.exports = {
  testEnvironment: 'node', // Use "jsdom" for front-end testing
  verbose: true, // Show individual test results
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'], // Test file patterns
  collectCoverage: true, // Collect test coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/index.{js,jsx}',
    '!src/**/*mock*.{js,jsx}',
  ],
  coverageDirectory: 'coverage', // Directory for coverage reports
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1', // Example for path aliases
  },
};
