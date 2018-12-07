const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const yaml = require('js-yaml');

const ConvertDefinition = [
  { from: 'assets/markdown/404.md', to: '../404.html' },
  { from: 'assets/markdown/index.md', to: '../index.html' },
  { from: 'assets/markdown/blog.md', to: '../blog/index.html' },
];

const templateDirPath = path.join(__dirname, '../assets/template');
ConvertDefinition.forEach((definition) => {
  const { from, to } = definition;
  const fromPath = path.join(__dirname, '..', from);
  const toPath = path.join(__dirname, '..', to);

  const data = fs.readFileSync(fromPath, 'utf-8');
  const splitData = data.split('---', 2);
  if (splitData.length !== 2) {
    throw new Error('Undefined page info.');
  }

  const pageInfo = yaml.safeLoad(splitData[0]);
  const content = marked(splitData[1]);

  const { template } = pageInfo;
  if (template == null) {
    throw new Error('Template undefined.');
  }

  const templatePath = path.join(templateDirPath, `${template}.html`);
  ejs.renderFile(templatePath, Object.assign({ content }, pageInfo), {}, (error, html) => {
    if (error) {
      throw new Error(error);
    }
    fs.writeFileSync(toPath, html);
  });
});
