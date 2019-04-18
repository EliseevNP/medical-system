let config = {
  parser: 'babel-eslint',
    'env': {
    'browser': true,
    'node': true,
    'es6': true
  },
  root: true,
  extends: 'eslint:recommended',
  rules: {
    'no-console': 'off',
    quotes: ['error', 'single', {'allowTemplateLiterals': true}],
    semi: ['error', 'always'],
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'sort-imports-es6-autofix/sort-imports-es6': ['error', {
        'ignoreCase': false,
        'ignoreMemberSort': false,
        'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
    }],
    'no-undef': 'error'
  },
  plugins: [
    'sort-imports-es6-autofix'
  ]
}

module.exports = config;