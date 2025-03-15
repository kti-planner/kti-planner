// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    ...eslintPluginAstro.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        files: ['src/**/*.ts', 'www/src/**/*.ts', 'www/src/**/*.astro'],
        languageOptions: {
            parserOptions: {
                project: true,
            },
        },
    },
    {
        rules: {
            // Possible Problems
            'no-duplicate-imports': 'error',

            // Suggestions
            'curly': ['error', 'all'],
            'one-var': ['error', 'never'],
            'prefer-const': [
                'error',
                {
                    'destructuring': 'all',
                },
            ],
            'sort-imports': [
                'error',
                {
                    'ignoreDeclarationSort': true,
                },
            ],

            // Layout & Formatting
            'unicode-bom': 'error',

            // Typescript
            'no-undef': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'args': 'none',
                    'destructuredArrayIgnorePattern': '.',
                },
            ],
            '@typescript-eslint/no-unused-expressions': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/no-confusing-void-expression': [
                'error',
                {
                    'ignoreArrowShorthand': true,
                },
            ],
            '@typescript-eslint/no-invalid-void-type': [
                'error',
                {
                    'allowAsThisParameter': true,
                },
            ],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    'allowAny': false,
                    'allowArray': false,
                    'allowBoolean': true,
                    'allowNever': false,
                    'allowNullish': false,
                    'allowNumber': true,
                    'allowRegExp': true,
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-useless-constructor': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/class-literal-property-style': 'off',
            '@typescript-eslint/consistent-indexed-object-style': 'off',
        },
    },
    {
        files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
        ...tseslint.configs.disableTypeChecked,
    },
    {
        ignores: ['build/', 'www/.astro/', 'www/dist/', 'www/public/'],
    },
    {
        // @typescript-eslint/no-misused-promises crashes on return statements in .astro files
        files: ['www/src/**/*.astro'],
        rules: {
            '@typescript-eslint/no-misused-promises': 'off',
        },
    },
);
