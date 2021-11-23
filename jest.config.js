module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: 'tests/tsconfig.spec.json',
    }
  },
  cacheDirectory: '.jest-cache',
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/types/**/*.ts',
  ],
};
