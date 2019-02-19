const ejs = require('ejs');
const fs = require('fs-extra');
const marked = require('marked');
const sass = require('node-sass');
const yaml = require('js-yaml');
const path = require('path');
const { rootDir } = require('./directory');

const imageFile = (relativePath) => {
  const filePath = rootDir(relativePath);
  const rawExtension = path.extname(filePath);
  const ext = rawExtension === 'jpg' ? 'jpeg' : rawExtension;
  const base64Data = fs.readFileSync(filePath, 'base64');
  return `data:image/${ext};base64,${base64Data}`;
};

const textFile = (relativePath) => {
  const filePath = rootDir(relativePath);
  return fs.readFileSync(filePath, 'utf8');
};

// ------------------------------

const renderer = new marked.Renderer();
renderer.heading = (text, level, raw) => (`<h${level} id="${raw}">${text}</h${level}>\n`);
const yamlExtractor = new RegExp('<!--\n[\\s\\S]+\n-->', 'm');
const convertMarkdown = (absolutePath) => {
  const markdown = fs.readFileSync(absolutePath, 'utf-8');
  const headerComment = markdown.match(yamlExtractor)[0] || '';
  const yamlText = headerComment.substring(5, headerComment.length - 4);
  const pageData = yaml.safeLoad(yamlText);
  const html = marked(markdown, { renderer });
  return Object.assign({ html, markdown }, pageData);
};

const convertTemplate = (templatePath, outputPath, embeddedData) => {
  ejs.renderFile(rootDir(templatePath), embeddedData, {}, (error, html) => {
    if (error != null) {
      throw new Error(error);
    }
    fs.mkdirsSync(path.dirname(rootDir(outputPath)));
    fs.writeFileSync(rootDir(outputPath), html);
    console.log('ejs comvert:', templatePath, '->', outputPath);
  });
};

const convertScss = (absolutePath) => {
  return sass
    .renderSync({
      file: absolutePath,
      outputStyle: 'compressed',
    })
    .css
    .toString()
    .trim();
};

const readFile = (absolutePath) => {
  return fs.readFileSync(absolutePath, 'utf-8').trim();
};

const writeFile = (absolutePath, content) => {
  fs.mkdirsSync(path.dirname(absolutePath));
  fs.writeFileSync(absolutePath, content);
};

module.exports = {
  imageFile,
  convertMarkdown,
  convertScss,
  convertTemplate,
  readFile,
  textFile,
  writeFile,
};
