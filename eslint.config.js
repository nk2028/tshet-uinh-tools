// @ts-check

import react from 'eslint-plugin-react';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default tseslint.config({
  files: ['*.?(c|m)js', 'src/**/*.?(c|m)js{,x}', 'src/**/*.ts{,x}'],
  extends: [
    js.configs.recommended,
    .../** @type {any[]} */ (
      compat.extends('plugin:react/recommended', 'plugin:react/jsx-runtime')
    ),
    ...tseslint.configs.recommended,
  ],
  plugins: {
    react,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
    },

    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module',

    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
});
