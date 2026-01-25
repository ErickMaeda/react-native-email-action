const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');
const prettier = require('eslint-plugin-prettier');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: [
      'node_modules/',
      'ios/',
      'android/',
      'Pods/',
      'vendor/',
      'dist/',
      'build/',
      'example/**',
      '.husky/**',
      'eslint.config.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        test: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-native': reactNative,
      prettier,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactNative.configs.all.rules,
      'prettier/prettier': 'error',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-native/split-platform-components': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      react,
      'react-native': reactNative,
      prettier,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactNative.configs.all.rules,
      'prettier/prettier': 'error',
      'react/prop-types': 'off',
      'react-native/split-platform-components': 'off',
    },
  },
];
