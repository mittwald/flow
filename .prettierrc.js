/** @type {import('prettier').Config} */

const config = {
  semi: true,
  singleQuote: false,
  printWidth: 80,
  tabWidth: 2,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  proseWrap: 'always',
  htmlWhitespaceSensitivity: 'css',
  overrides: [
    {
      files: ['*.json', '*.yaml', '*.yml'],
      options: {
        tabWidth: 2,
      },
    },
  ],
  plugins: [
    await import('prettier-plugin-sort-json'),
    await import('prettier-plugin-jsdoc'),
    await import('prettier-plugin-pkgsort'),
  ],
};

export default config;
