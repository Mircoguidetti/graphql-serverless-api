module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.graphql$': 'graphql-import-node/jest',
  },
  testMatch: ['<rootDir>/src/**/*-test.ts'],
}
