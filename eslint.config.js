import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
import {includeIgnoreFile} from "@eslint/compat";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ts.configs.recommended,
    svelte.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
        ignores: ["eslint.config.js", "svelte.config.js"],

        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: ['.svelte'],
                parser: ts.parser,
                svelteConfig
            }
        }
    },
    {
        rules: {
            // these rules are disabled as the code was written before they existed
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off"
        }
    }
);
