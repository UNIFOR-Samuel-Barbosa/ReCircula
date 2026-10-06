import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
	{
		ignores: ["dist/**", "node_modules/**"],
	},
	js.configs.recommended,
	{
		files: ["src/**/*.{js,jsx}"],
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			"no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^[A-Z_]",
					varsIgnorePattern: "^[A-Z_]",
				},
			],
			...reactHooks.configs.recommended.rules,
			...reactRefresh.configs.vite.rules,
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
		},
	},
	{
		files: ["vite.config.js"],
		languageOptions: {
			globals: globals.node,
		},
	},
	eslintConfigPrettier,
];
