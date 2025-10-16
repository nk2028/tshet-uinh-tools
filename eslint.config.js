// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from 'eslint/config';
import react from "eslint-plugin-react";
import reactHooks from 'eslint-plugin-react-hooks';
import globals from "globals";
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default defineConfig({
	files: ["*.?(c|m)js", "src/**/*.?(c|m)js{,x}", "src/**/*.ts{,x}"],
	extends: [
		js.configs.recommended,
		.../** @type {any[]} */ (
			compat.extends("plugin:react/recommended", "plugin:react/jsx-runtime")
		),
		reactHooks.configs.flat.recommended,
	],
	plugins: {
		react,
	},

	languageOptions: {
		globals: {
			...globals.browser,
		},

		parser: tsParser,
		ecmaVersion: "latest",
		sourceType: "module",

		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
		},
	},

	settings: {
		react: {
			version: "detect",
		},
	},

	rules: {},
}, {
	files: ["src/**/*.ts{,x}"],
	extends: [
		...tseslint.configs.recommendedTypeChecked,
		// ...tseslint.configs.strictTypeChecked,
		...tseslint.configs.stylisticTypeChecked,
	],

	languageOptions: {
		parserOptions: {
			project: true,
			tsconfigRootDir: __dirname,
		},
	},

	rules: {},
});
