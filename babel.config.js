module.exports = {
  plugins: [
  ],
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-transform-export-namespace-from'
      ]
    }
  }
};
