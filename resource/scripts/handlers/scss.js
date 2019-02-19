const { rootDir } = require('../lib/directory');
const {
  convertScss,
  writeFile,
} = require('../lib/file');

const cssSource = convertScss(rootDir('assets/css/scss/index.scss'));
writeFile(rootDir('assets/css/index.css'), cssSource);

