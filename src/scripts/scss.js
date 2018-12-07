const fs = require('fs');
const path = require('path');
const sass = require('node-sass');

const entryFilePath = path.join(__dirname, '../assets/scss/index.scss');
const toFilePath = path.join(__dirname, '../../assets/style.css');

sass.render({
  file: entryFilePath,
  outputStyle: 'compressed',
}, (error, result) => {
  if (error) {
    throw new Error(error);
  }
  fs.writeFileSync(toFilePath, result.css.toString());
});