import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import imports from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier'; // Prettier 추천 설정 추가
import globals from 'globals';

export default [
  {
    // 적용 범위: 모든 .js, .jsx, .ts, .tsx 파일
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules/', 'dist/', 'build/'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      react,
      'react-hooks': reactHooks,
      import: imports,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs['recommended'].rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...prettierConfig.rules, // prettier.configs.recommended 대신 사용

      // TypeScript 관련 규칙
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // React 관련 규칙
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off', // TypeScript 사용 시 prop-types 불필요

      // 일반 JavaScript 규칙
      'no-undef': 'off', // TypeScript가 타입 체크를 대신함

      // Import 정렬 규칙
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'unknown',
          ],
          pathGroups: [
            {
              pattern: 'react', // React 관련
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**', // 내부 모듈 (@로 시작하는 별칭)
              group: 'internal',
              position: 'after',
            },
            {
              pattern: './**', // 로컬 파일
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
];
