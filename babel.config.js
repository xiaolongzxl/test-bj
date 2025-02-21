module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
      },
      {
        useBuiltIns: 'usage',
        corejs: {
          version: '3',
          proposal: true,
        },
        targets: {
          chrome: '52',
          safari: '10',
        },
      },
    ],
  ],
  sourceType: 'unambiguous',
};
