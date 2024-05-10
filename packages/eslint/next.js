const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['eslint:recommended', 'next', 'turbo'],
  globals: {
    React: true,
    JSX: true
  },
  env: {
    node: true
  },
  plugins: ['only-warn'],
  settings: {
    'import/resolver': {
      typescript: {
        project
      }
    }
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/'
  ],
  overrides: [
    // Force ESLint to detect .tsx files
    {
      files: ['*.js?(x)', '*.ts?(x)'],
      rules: {
        'no-undef': 'off'
      }
    }
  ]
}
