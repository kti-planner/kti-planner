// @ts-check

import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    ...eslintPluginAstro.configs.recommended,
    ...eslintPluginVue.configs['flat/recommended'],
    {
        plugins: {
            'simple-import-sort': eslintPluginSimpleImportSort,
        },
    },
    eslintPluginPrettierRecommended,
    {
        files: ['src/**/*.ts', 'www/src/**/*.ts', 'www/src/**/*.astro', 'www/src/**/*.vue', 'www/tests/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: true,
            },
        },
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

            // Vue
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
            'vue/attributes-order': [
                'error',
                {
                    'order': [
                        'DEFINITION',
                        'SLOT',
                        'CONDITIONALS',
                        'LIST_RENDERING',
                        'RENDER_MODIFIERS',
                        ['UNIQUE', 'TWO_WAY_BINDING', 'OTHER_DIRECTIVES', 'GLOBAL', 'OTHER_ATTR', 'EVENTS'],
                        'CONTENT',
                    ],
                    'alphabetical': false,
                },
            ],
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
            'vue/html-button-has-type': 'error',
            'vue/match-component-import-name': 'error',
            'vue/no-empty-component-block': 'error',
            'vue/no-multiple-objects-in-class': 'error',
            'vue/no-undef-components': 'error',
            'vue/no-unused-emit-declarations': 'error',
            'vue/no-unused-refs': 'error',
            'vue/no-useless-v-bind': 'error',
            'vue/padding-line-between-blocks': 'error',
            'vue/prefer-define-options': 'error',
            'vue/require-macro-variable-name': 'error',
            'vue/require-typed-ref': 'error',
            'vue/v-for-delimiter-style': 'error',
            'vue/valid-define-options': 'error',
            'vue/html-closing-bracket-newline': 'off',
            'vue/singleline-html-element-content-newline': 'off',
            'vue/multiline-html-element-content-newline': 'off',
            'vue/max-attributes-per-line': 'off',
            'vue/first-attribute-linebreak': 'off',
            'vue/require-default-prop': 'off',
            'vue/multi-word-component-names': 'off',
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
