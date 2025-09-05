// @ts-check

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    ...eslintPluginAstro.configs.recommended,
    ...eslintPluginVue.configs['flat/recommended'],
    {
        plugins: {
            'simple-import-sort': eslintPluginSimpleImportSort,
            '@stylistic': stylistic,
        },
    },
    eslintPluginPrettierRecommended,
    {
        files: ['src/**/*.ts', 'www/src/**/*.ts', 'www/src/**/*.astro', 'www/src/**/*.vue', 'www/tests/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['www/tests/unit/**/*.ts'],
        ...vitest.configs.recommended,
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser',
                extraFileExtensions: ['.vue'],
            },
        },
    },
    {
        rules: {
            // Possible Problems
            'no-duplicate-imports': 'error',

            // Suggestions
            'curly': ['error', 'all'],
            'eqeqeq': 'error',
            'one-var': ['error', 'never'],
            'prefer-const': [
                'error',
                {
                    'destructuring': 'all',
                },
            ],

            // Layout & Formatting
            'unicode-bom': 'error',

            // Imports
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        [
                            // Side effect imports
                            '^\\u0000',
                            // Node.js builtins prefixed with `node:`
                            '^node:',
                            '^astro$',
                            '^astro/',
                            '^vue$',
                            // Packages (things that start with a letter (or digit or underscore), or `@` followed by a letter)
                            '^@?\\w',
                            // Absolute imports
                            '^@backend/',
                            '^@components/frontend/',
                            '^@components/',
                            '^@layouts/',
                            '^@components/.*\\.(vue|astro)',
                            '^@pages/',
                            // Anything not matched in another group
                            '^',
                            // Relative imports (anything that starts with a dot)
                            '^\\.',
                        ],
                    ],
                },
            ],
            'simple-import-sort/exports': 'error',

            // Typescript
            'no-undef': 'off',
            '@typescript-eslint/class-literal-property-style': 'off',
            '@typescript-eslint/consistent-indexed-object-style': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    'disallowTypeAnnotations': false,
                    'fixStyle': 'inline-type-imports',
                },
            ],
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-extraneous-class': 'off',
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unnecessary-condition': [
                'error',
                {
                    allowConstantLoopConditions: 'only-allowed-literals',
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'args': 'none',
                    'destructuredArrayIgnorePattern': '.',
                    'ignoreRestSiblings': true,
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
            '@typescript-eslint/return-await': ['error', 'always'],
            '@typescript-eslint/strict-boolean-expressions': 'error',

            // Vue
            'vue/attributes-order': [
                'error',
                {
                    'order': [
                        'DEFINITION',
                        'CONDITIONALS',
                        'LIST_RENDERING',
                        'RENDER_MODIFIERS',
                        'UNIQUE',
                        'SLOT',
                        'GLOBAL',
                        'TWO_WAY_BINDING',
                        'OTHER_DIRECTIVES',
                        'OTHER_ATTR',
                        'EVENTS',
                        'CONTENT',
                    ],
                    'alphabetical': false,
                },
            ],
            'vue/block-lang': [
                'error',
                {
                    'script': {
                        'lang': 'ts',
                    },
                },
            ],
            'vue/block-order': [
                'error',
                {
                    'order': ['script', 'template', 'style'],
                },
            ],
            'vue/component-name-in-template-casing': 'error',
            'vue/component-options-name-casing': 'error',
            'vue/custom-event-name-casing': 'error',
            'vue/define-emits-declaration': ['error', 'type-literal'],
            'vue/define-props-declaration': 'error',
            'vue/enforce-style-attribute': [
                'error',
                {
                    'allow': ['scoped'],
                },
            ],
            'vue/first-attribute-linebreak': 'off',
            'vue/html-button-has-type': 'error',
            'vue/html-self-closing': [
                'error',
                {
                    'html': {
                        'void': 'any',
                        'normal': 'any',
                        'component': 'always',
                    },
                    'svg': 'always',
                    'math': 'always',
                },
            ],
            'vue/match-component-import-name': 'error',
            'vue/multi-word-component-names': 'off',
            'vue/no-empty-component-block': 'error',
            'vue/no-multiple-objects-in-class': 'error',
            'vue/no-undef-components': 'error',
            'vue/no-unused-emit-declarations': 'error',
            'vue/no-unused-refs': 'error',
            'vue/no-useless-v-bind': 'error',
            'vue/order-in-components': [
                'error',
                {
                    'order': [
                        'props',
                        'emits',
                        'expose',
                        'directives',
                        'components',
                        'data',
                        'watch',
                        'methods',
                        'computed',
                        'LIFECYCLE_HOOKS',
                    ],
                },
            ],
            'vue/padding-line-between-blocks': 'error',
            'vue/prefer-define-options': 'error',
            'vue/require-default-prop': 'off',
            'vue/require-macro-variable-name': 'error',
            'vue/require-typed-ref': 'error',
            'vue/v-for-delimiter-style': 'error',
            'vue/valid-define-options': 'error',

            // Stylistic
            '@stylistic/padding-line-between-statements': [
                'error',
                { 'blankLine': 'always', 'prev': 'import', 'next': '*' },
                { 'blankLine': 'any', 'prev': 'import', 'next': 'import' },

                { 'blankLine': 'always', 'prev': 'block-like', 'next': '*' },

                { 'blankLine': 'always', 'prev': 'multiline-const', 'next': '*' },
                { 'blankLine': 'always', 'prev': 'multiline-export', 'next': '*' },
                { 'blankLine': 'always', 'prev': 'multiline-expression', 'next': '*' },
                { 'blankLine': 'always', 'prev': 'multiline-let', 'next': '*' },
                { 'blankLine': 'always', 'prev': 'multiline-using', 'next': '*' },
                { 'blankLine': 'always', 'prev': 'multiline-var', 'next': '*' },

                { 'blankLine': 'always', 'prev': '*', 'next': 'multiline-const' },
                { 'blankLine': 'always', 'prev': '*', 'next': 'multiline-export' },
                { 'blankLine': 'always', 'prev': '*', 'next': 'multiline-expression' },
                { 'blankLine': 'always', 'prev': '*', 'next': 'multiline-let' },
                { 'blankLine': 'always', 'prev': '*', 'next': 'multiline-using' },
                { 'blankLine': 'always', 'prev': '*', 'next': 'multiline-var' },
            ],
        },
    },
    {
        files: ['www/src/**/*.ts', 'www/src/**/*.astro'],
        rules: {
            '@typescript-eslint/no-restricted-imports': [
                'error',
                {
                    'patterns': [
                        {
                            'group': ['@components/frontend/'],
                            'allowTypeImports': true,
                        },
                        {
                            'group': ['*.client.ts'],
                            'allowTypeImports': true,
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ['www/src/components/**/*.ts'],
        rules: {
            '@typescript-eslint/no-restricted-imports': [
                'error',
                {
                    'patterns': [
                        {
                            'group': ['@backend/'],
                            'allowTypeImports': true,
                        },
                        {
                            'group': ['@components/frontend/'],
                            'allowTypeImports': true,
                        },
                    ],
                },
            ],
        },
    },
    {
        files: [
            'www/src/components/frontend/**/*.ts',
            'www/src/components/**/*.client.ts',
            'www/src/components/**/*.vue',
        ],
        rules: {
            '@typescript-eslint/no-restricted-imports': [
                'error',
                {
                    'patterns': [
                        {
                            'group': ['@backend/'],
                            'allowTypeImports': true,
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
        ...tseslint.configs.disableTypeChecked,
    },
    {
        files: ['www/src/**/*.vue'],
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
