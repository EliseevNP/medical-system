const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const lessOverrides = require('./src/config/less');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      ...lessOverrides
    }
  })
);