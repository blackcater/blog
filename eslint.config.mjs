import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

/** @type {import('@antfu/eslint-config').antfu} */
export default antfu(
  // antfu recommended
  {
    formatters: {
      css: true,
      html: true,
    },
    react: true,
    rules: {
      'import/order': 'off', // conflicts with perfectionist,
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-enums': 'off',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-jsx-props': [
        'error',
        {
          'type': 'natural',
          'order': 'asc',
          'custom-groups': {
            callback: 'on*',
          },
          'groups': ['multiline', 'unknown', 'callback', 'shorthand'],
        },
      ],
    },
  },
  
  // tailwindcss recommended
  ...compat.config({
    extends: [
      'plugin:tailwindcss/recommended',
    ],
    rules: {
      'tailwindcss/no-custom-classname': 'off',
    },
    settings: {
      tailwindcss: {
        callees: ['classnames', 'clsx', 'ctl', 'cn', 'tv', 'tm'],
      },
    },
  }),

  // Overrides
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'node/prefer-global/process': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
)
