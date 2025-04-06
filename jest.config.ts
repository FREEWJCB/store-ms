import { config } from 'dotenv';
import path from 'path';

config({
  path: path.resolve(process.cwd(), '.env.testing'),
});

module.exports = {
  verbose: true,
  slowTestThreshold: 30,
  coverageReporters: ['json', 'html'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
    '^@test/(.*)$': '<rootDir>/../test/$1',
  },
  setupFilesAfterEnv: ['jest-extended/all'],
};
