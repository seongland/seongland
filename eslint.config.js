import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettier,
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'agentroom-article/',
      'asg-article/',
      'asg-browser/',
      'confidence-manifold-article/',
      'corrsteer-article/',
      'crl-article/',
      'optimismbench-article/',
      'paat-article/',
      '**/*.js',
      '**/*.cjs',
      '!eslint.config.js',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error', 'debug', 'info'] }],
    },
  },
)
