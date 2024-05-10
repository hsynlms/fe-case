module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009'
        },
        stage: 3,
        features: {
          'custom-properties': false
        }
      }
    ],
    'postcss-normalize',
    'postcss-discard-comments',
    [
      'postcss-sorting',
      {
        order: [
          'custom-properties',
          'dollar-variables',
          'declarations',
          'at-rules',
          'rules'
        ],
        'properties-order': 'alphabetical',
        'unspecified-properties-position': 'bottomAlphabetical'
      }
    ],
    'postcss-merge-rules',
    'postcss-selector-not',
    'postcss-discard-duplicates',
    'postcss-discard-empty',
    'postcss-minify-selectors',
    'postcss-ordered-values',
    'postcss-calc'
  ]
}
