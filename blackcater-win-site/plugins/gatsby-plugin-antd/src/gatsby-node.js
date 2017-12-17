exports.modifyBabelrc = ({ babelrc }) => ({
  ...babelrc,
  plugins: babelrc.plugins.concat([
    'import', {
      libraryName: 'antd',
      style: true
    }
  ])
})
