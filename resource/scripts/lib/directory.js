const path = require('path');

const rootDirPath = path.join(__dirname, '../../..');
const rootDir = (relativePath) => path.join(rootDirPath, relativePath);

module.exports = {
  rootDir,
};
