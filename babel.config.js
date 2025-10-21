module.exports = {
  plugins: [
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: { node: 'current' }
        }]
      ],
      plugins: [
        '@babel/plugin-transform-export-namespace-from'
      ]
    }
  }
};
