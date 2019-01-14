const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

const rootDirPath = path.join(__dirname, '../../..');
const assetsDirPath = path.join(rootDirPath, 'assets');
const srcDirPath = path.join(rootDirPath, 'src');
const blogDirPath = path.join(srcDirPath, 'blog');
const resourceDirPath = path.join(srcDirPath, 'resource');
const componentDirPath = path.join(srcDirPath, 'component');
const outputDirPath = isDevelopment ? path.join(srcDirPath, '.temp') : rootDirPath;

const assetsDir = (relativePath) => path.join(assetsDirPath, relativePath);
const blogDir = (relativePath) => path.join(blogDirPath, relativePath);
const componentDir = (relativePath) => path.join(componentDirPath, relativePath);
const outputDir = (relativePath) => path.join(outputDirPath, relativePath);
const resourceDir = (relativePath) => path.join(resourceDirPath, relativePath);
const rootDir = (relativePath) => path.join(rootDirPath, relativePath);
const srcDir = (relativePath) => path.join(srcDirPath, relativePath);

module.exports = {
  assetsDir,
  blogDir,
  componentDir,
  outputDir,
  resourceDir,
  rootDir,
  srcDir,
};
