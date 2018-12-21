const fs = require('fs-extra');
const read = require('fs-readdir-recursive');
const ejs = require('ejs');
const marked = require('marked');
const yaml = require('js-yaml');
const path = require('path');
const sass = require('node-sass');

const version = (new Date()).toISOString();
const isDevelopment = process.env.NODE_ENV === 'development';

const root = path.join(__dirname, '..');
const resourceDir = path.join(root, 'resource');
const outputDir = path.join(root, isDevelopment ? '.temp' : '..');

const renderer = new marked.Renderer();
renderer.heading = (text, level, raw) => (`<h${level} id="${raw}">${text}</h${level}>\n`);

const DefaultData = {
  version,
  template: 'default',
  title: 'No Title',
  description: 'Web系フルスタックエンジニア hyiromori のポートフォリオサイトです。',
  keywords: 'portfolio, hyiromori',
};

const resource = (relativePath) => path.join(resourceDir, relativePath);
const output = (relativePath) => path.join(outputDir, relativePath);

const getData = (customData) => {
  const data = Object.assign({}, DefaultData, customData);
  data.metaTitle = `${data.title} | Portfolio by hyiromori`;
  return data;
};


// ----- Converter -----

const convertMarkdown = (
  markdownFilePath,
  templateHtmlPath,
  customData = {},
) => new Promise((resolve, reject) => {
  const splitData = fs.readFileSync(markdownFilePath, 'utf-8').split('---');
  if (splitData.length < 2) {
    throw new Error('Undefined page info.');
  }

  const variables = yaml.safeLoad(splitData[0]);
  const pageData = getData(Object.assign({}, variables, customData));
  const content = marked(ejs.render(splitData.slice(1).join('---'), pageData), { renderer });

  ejs.renderFile(templateHtmlPath, Object.assign({ content }, pageData), {}, (error, html) => {
    if (error) {
      reject(error);
    }
    resolve({ html, variables });
  });
});

// ----- HOME -----

const convertHome = () => {
  convertMarkdown(resource('home.md'), resource('home.html')).then((result) => {
    fs.writeFileSync(output('index.html'), result.html);
  });

  const EXCLUDE = new RegExp('.*assets/styles/index/.*');
  const cacheFiles = JSON.stringify(
    read(resource('assets'))
      .map(path => `/assets/${path}`)
      .filter(src => !src.match(EXCLUDE)),
  );
  ejs.renderFile(resource('service_worker.js'), { version, cacheFiles }, (error, html) => {
    if (error) {
      throw new Error(error);
    }
    fs.writeFileSync(output('service_worker.js'), html);
  });
};

// ----- 404 -----

const convert404 = () => {
  convertMarkdown(resource('404.md'), resource('404.html')).then((result) => {
    fs.writeFileSync(output('404.html'), result.html);
  });
};

// ----- Blog -----

const convertBlog = () => {
  const BlogFileRegexp = /^20\d\d-\d\d-\d\d_[A-Za-z0-9-]+\.md$/;
  Promise.all(fs
    .readdirSync(resource('blog/article'))
    .filter(file => file.match(BlogFileRegexp))
    .sort().reverse()
    .map((blog) => {
      const splited = blog.split('_');
      const absolutePath = `/blog/${splited[0].substring(0, 7)}/${splited[1].split('.')[0]}.html`;
      return convertMarkdown(resource(`blog/article/${blog}`), resource('blog/article.html'))
        .then((result) => {
          fs.mkdirsSync(path.dirname(output(absolutePath)));
          fs.writeFileSync(output(absolutePath), result.html);
          return Object.assign({ absolutePath, date: splited[0] }, result.variables);
        });
    }),
  ).then((blogs) => {
    return convertMarkdown(resource('blog/blog.md'), resource('blog/blog.html'), { blogs });
  }).then((result) => {
    fs.writeFileSync(output('blog/index.html'), result.html);
  });
};

// ----- Laboratory -----

const convertLaboratory = () => {
  convertMarkdown(resource('laboratory/laboratory.md'), resource('laboratory/laboratory.html'))
    .then((result) => fs.writeFileSync(output('laboratory/index.html'), result.html));

  ejs.renderFile(resource('laboratory/service_worker.js'), { version }, (error, html) => {
    if (error) {
      throw new Error(error);
    }
    fs.writeFileSync(output('laboratory/service_worker.js'), html);
  });
};

// ----- Assets -----

const copyAssets = () => {
  const EXCLUDE = new RegExp('.*assets/styles/index/.*');
  const filter = (src/*, dist*/) => !src.match(EXCLUDE);
  fs.copySync(resource('assets'), output('assets'), { filter });
};

// ----- SCSS -----

convertScss = () => {
  sass.render({
    file: resource('assets/styles/index/index.scss'),
    outputStyle: 'compressed',
  }, (error, result) => {
    if (error) {
      throw new Error(error);
    }
    fs.writeFileSync(output('assets/styles/index.css'), result.css.toString());
    fs.writeFileSync(output('laboratory/index.css'), result.css.toString());
  });
};

// ----- Execute -----
convertHome();
convert404();
convertBlog();
convertLaboratory();
copyAssets();
convertScss();
