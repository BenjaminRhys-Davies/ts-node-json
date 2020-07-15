process.env.TZ = 'GMT';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.{js,ts}', '!**/node_modules/**', '!**/build/**', '!**/coverage/**'],
  modulePaths: ['./'],
};
