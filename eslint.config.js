import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
	js.configs.recommended,
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsParser,
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			"@typescript-eslint/no-explicit-any": "off",
			// TypeScript's type checker handles undefined variable detection
			"no-undef": "off",
		},
	},
	prettier,
	{
		ignores: [
			"node_modules/**",
			"dist/**",
			"coverage/**",
			"demo/**",
			"test/*.js",
		],
	},
];
