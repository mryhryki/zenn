const fs = require('fs-extra');

const {
  assetsDir,
  blogDir,
  componentDir,
  outputDir,
  resourceDir,
  rootDir,
  srcDir,
} = require('./lib/directory');
const {
  convertMarkdown,
  convertScss,
  convertTemplate,
  readFile,
  writeFile,
} = require('./lib/file');
const {
  getEmbeddedData,
} = require('./lib/embedded_data');

// ----- Embedded Files -----

const css = convertScss(componentDir('scss/index.scss'));
const highlight = readFile(componentDir('js/highlight.pack.js'));

// ----- HOME -----

const convertHome = () => {
  const pageData = convertMarkdown(resourceDir('home.md'));
  const embeddedData = getEmbeddedData(pageData, { css });
  convertTemplate(resourceDir('home.html'), embeddedData)
    .then((result) => writeFile(outputDir('index.html'), result.html));

  convertTemplate(resourceDir('service_worker.js'), getEmbeddedData())
    .then((result) => writeFile(outputDir('service_worker.js'), result.html));
};

// ----- 404 -----

const convert404 = () => {
  const pageData = convertMarkdown(resourceDir('404.md'));
  const embeddedData = getEmbeddedData(pageData, { css });
  convertTemplate(resourceDir('404.html'), embeddedData)
    .then((result) => writeFile(outputDir('404.html'), result.html));
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
      const embeddedData = getEmbeddedData(page, { css, highlight });
      convertTemplate(resourceDir('blog/article.html'), embeddedData)
        .then((result) => writeFile(outputDir(absolutePath), result.html));
      return { page, absolutePath };
    });
  const pageData = convertMarkdown(resourceDir('blog/blog.md'));
  const embeddedData = getEmbeddedData(Object.assign({ entries }, pageData), { css });
  convertTemplate(resourceDir('blog/blog.html'), embeddedData)
    .then((result) => writeFile(outputDir('blog/index.html'), result.html));
};

// ----- Laboratory -----

const convertLaboratory = () => {
  const pageData = convertMarkdown(resourceDir('laboratory/laboratory.md'));
  const embeddedData = getEmbeddedData(pageData, { css });
  convertTemplate(resourceDir('laboratory/laboratory.html'), embeddedData)
    .then((result) => writeFile(outputDir('laboratory/index.html'), result.html));

  convertTemplate(resourceDir('laboratory/service_worker.js'), getEmbeddedData())
    .then((result) => writeFile(outputDir('laboratory/service_worker.js'), result.html));
};

// ----- Assets -----

const copyAssets = () => {
  if (process.env.NODE_ENV !== 'development') return;
  fs.copySync(rootDir('assets'), outputDir('assets'));
};

// ----- Execute -----

copyAssets();
convertHome();
convert404();
convertBlog();
convertLaboratory();
