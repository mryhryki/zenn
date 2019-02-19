const fs = require('fs-extra');
const { rootDir } = require('../lib/directory');
const {
  convertTemplate,
  imageFile,
  textFile,
} = require('../lib/file');

const version = (new Date()).toISOString();
const data = { imageFile, textFile, version };

convertTemplate('404.ejs.html', '404.html', data);
convertTemplate('index.ejs.html', 'index.html', data);
convertTemplate('service_worker.ejs.js', 'service_worker.js', data);
convertTemplate('laboratory/index.ejs.html', 'laboratory/index.html', data);
convertTemplate('laboratory/service_worker.ejs.js', 'laboratory/service_worker.js', data);
