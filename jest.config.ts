/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageProvider: "v8",
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
};

export default config;