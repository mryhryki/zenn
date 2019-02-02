const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';
const rootDirPath = path.join(__dirname, '../..');
const resourceDirPath = path.join(rootDirPath, 'resource');

const blogDirPath = path.join(rootDirPath, 'blog');
const laboratoryDirPath = path.join(rootDirPath, 'laboratory');
const componentDirPath = path.join(resourceDirPath, 'component');
const markdownDirPath = path.join(resourceDirPath, 'markdown');
const scssDirPath = path.join(resourceDirPath, 'scss');
const staticDirPath = path.join(resourceDirPath, 'static');
const templateDirPath = path.join(resourceDirPath, 'template');
const outputDirPath = path.join(rootDirPath, isDevelopment ? '.temp' : '..');

const blogDir = (relativePath) => path.join(blogDirPath, relativePath);
const componentDir = (relativePath) => path.join(componentDirPath, relativePath);
const laboratoryDir = (relativePath) => path.join(laboratoryDirPath, relativePath);
const markdownDir = (relativePath) => path.join(markdownDirPath, relativePath);
const outputDir = (relativePath) => path.join(outputDirPath, relativePath);
const scssDir = (relativePath) => path.join(scssDirPath, relativePath);
const staticDir = (relativePath) => path.join(staticDirPath, relativePath);
const templateDir = (relativePath) => path.join(templateDirPath, relativePath);

module.exports = {
  blogDir,
  componentDir,
  laboratoryDir,
  markdownDir,
  outputDir,
  scssDir,
  staticDir,
  templateDir,
};
