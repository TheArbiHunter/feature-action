import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions'],
        },
      ],
    },
  },
  {
    ignores: [
      '.git/**',
      '.vscode/**',
      'node_modules/**',
      'dist/**',
      'public/**',
      'build/**',
      'coverage/**',
      '__test__/**',
      '*.d.ts',
      '.prettierrc.js',
      '.eslintrc.js',
      'eslint.config.js',
      'jest.*.js',
    ],
  },
);
