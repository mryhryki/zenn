const fs = require('fs-extra');

const {
  blogDir,
  componentDir,
  laboratoryDir,
  markdownDir,
  outputDir,
  scssDir,
  staticDir,
  templateDir,
} = require('./lib/directory');
const {
  convertMarkdown,
  convertScss,
  convertTemplate,
  readFile,
  writeFile,
} = require('./lib/file');
const { getEmbeddedData } = require('./lib/embedded_data');

// ----- SCSS -----

const convertCss = () => {
  const cssSource = convertScss(scssDir('index.scss'));
  writeFile(componentDir('css/index.css'), cssSource);
};

// ----- Static Files -----

const copyStaticFiles = () => {
  fs.copySync(staticDir(''), outputDir(''));
};

// ----- 404 -----

const convert404 = () => {
  const pageData = convertMarkdown(markdownDir('404.md'));
  const embeddedData = getEmbeddedData(pageData);
  convertTemplate(templateDir('404.html'), embeddedData)
    .then((result) => writeFile(outputDir('404.html'), result.html));
};

// ----- HOME -----

const convertHome = () => {
  const pageData = convertMarkdown(markdownDir('home.md'));
  const embeddedData = getEmbeddedData(pageData);
  convertTemplate(templateDir('home.html'), embeddedData)
    .then((result) => writeFile(outputDir('index.html'), result.html));

  convertTemplate(laboratoryDir('service_worker.js'), getEmbeddedData())
    .then((result) => writeFile(outputDir('service_worker.js'), result.html));
};

// ----- Laboratory -----

const convertLaboratory = () => {
  const pageData = convertMarkdown(markdownDir('laboratory.md'));
  const embeddedData = getEmbeddedData(pageData);
  convertTemplate(templateDir('laboratory.html'), embeddedData)
    .then((result) => writeFile(outputDir('laboratory/index.html'), result.html));

  convertTemplate(laboratoryDir('service_worker.js'), getEmbeddedData())
    .then((result) => writeFile(outputDir('laboratory/service_worker.js'), result.html));
};

// ----- Blog -----

const convertBlog = () => {
  const BlogFileRegexp = /^20\d\d-\d\d-\d\d_[A-Za-z0-9-]+\.md$/;
  const entries = fs
    .readdirSync(blogDir('.'))
    .filter(file => file.match(BlogFileRegexp))
    .sort().reverse()
    .map((blogFile) => {
      const page = convertMarkdown(blogDir(blogFile));
      const split = blogFile.split('_');
      const absolutePath = `/blog/${split[0]}/${split[1].split('.')[0]}.html`;
      const embeddedData = getEmbeddedData(page);
      convertTemplate(templateDir('article.html'), embeddedData)
        .then((result) => writeFile(outputDir(absolutePath), result.html));
      return { page, absolutePath };
    });
  const pageData = convertMarkdown(markdownDir('blog.md'));
  const embeddedData = getEmbeddedData(Object.assign({ entries }, pageData));
  convertTemplate(templateDir('blog.html'), embeddedData)
    .then((result) => writeFile(outputDir('blog/index.html'), result.html));
};

// ----- Execute -----

convertCss();
copyStaticFiles();
convert404();
convertHome();
convertLaboratory();
convertBlog();
