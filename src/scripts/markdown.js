const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const yaml = require('js-yaml');

const root = path.join(__dirname, '..');

const DefaultData = {
  template: 'default',
  title: 'No Title',
  description: 'Web系フルスタックエンジニア hyiromori のポートフォリオサイトです。',
  keywords: 'portfolio, hyiromori',
};
const getData = (pageData) => {
  const data = Object.assign({}, DefaultData, pageData);
  data.metaTitle = `${data.title} | Portfolio by hyiromori`;
  return data;
};

const ConvertDefinition = [
  { from: 'assets/markdown/404.md', to: '../404.html' },
  { from: 'assets/markdown/index.md', to: '../index.html' },
  { from: 'assets/markdown/blog.md', to: '../blog/index.html' },
  { from: 'assets/markdown/laboratory.md', to: '../laboratory/index.html' },
];

const BlogFileRegexp = /^20\d\d-\d\d-\d\d_[A-Za-z0-9-]+\.md$/;
const blogDirPath = path.join(__dirname, '../blog');
const blogList = fs.readdirSync(blogDirPath)
                   .filter(file => file.match(BlogFileRegexp))
                   .sort().reverse()
                   .map((blog) => {
                     const splited = blog.split('_');
                     const absolutePath =
                       `/blog/${splited[0].substring(0, 7)}/${splited[1].split('.')[0]}.html`;
                     return {
                       from: path.join(root, 'blog', blog),
                       to: path.join(root, `..${absolutePath}`),
                       absolutePath,
                       date: splited[0],
                     };
                   });

const renderer = new marked.Renderer();
renderer.heading = (text, level, raw) => (`<h${level} id="${raw}">${text}</h${level}>\n`);

const templateDirPath = path.join(__dirname, '../assets/template');
const convert = (from, to, data) => {
  const dir = path.dirname(to);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const splitData = fs.readFileSync(from, 'utf-8').split('---');
  if (splitData.length < 2) {
    throw new Error('Undefined page info.');
  }
  const pageData = getData(Object.assign({}, yaml.safeLoad(splitData[0]), data));
  const content = marked(ejs.render(splitData.slice(1).join('---'), pageData), { renderer });
  const { template } = pageData;

  const templatePath = path.join(templateDirPath, `${template}.html`);
  ejs.renderFile(templatePath, Object.assign({ content }, pageData), {}, (error, html) => {
    if (error) {
      throw new Error(error);
    }
    fs.writeFileSync(to, html);
  });
  return pageData;
};

const blogs = blogList.map((blog) => {
  const { from, to, absolutePath, date } = blog;
  return convert(from, to, { absolutePath, createdAt: date });
});

ConvertDefinition.forEach((definition) => {
  const { from, to } = definition;
  return convert(from, to, { blogs });
});
