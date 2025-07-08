import type { Config } from '@jest/types';
 
const config: Config.InitialOptions = {
  testEnvironment: 'jest-environment-jsdom',
 
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', 
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  collectCoverage: true, 
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  coverageReporters: ['text', 'lcov', 'json'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
 
export default config;