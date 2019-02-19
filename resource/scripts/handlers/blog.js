const fs = require('fs-extra');
const { JSDOM } = require('jsdom');

const { rootDir } = require('../lib/directory');
const {
  convertTemplate,
  imageFile,
  textFile,
} = require('../lib/file');

const version = (new Date()).toISOString();
const data = { imageFile, textFile, version };

const FORMAT = /^20\d\d-\d\d-\d\d_[A-Za-z0-9-]+\.ejs\.html$/;
const entries = fs
  .readdirSync(rootDir('blog/articles'))
  .filter(file => file.match(FORMAT))
  .sort()
  .reverse()
  .map((entry) => {
    const relativePath = `blog/articles/${entry}`;
    const content = textFile(relativePath);

    const { document } = new JSDOM(content).window;
    const title = document.querySelector('h1').textContent;
    const listItems = document.querySelectorAll('#article-keywords > li');
    const createdAt = document.querySelector('#created-at').textContent;
    const updatedAt = document.querySelector('#updated-at').textContent;
    const description = document.querySelector('p').textContent.trim();

    const articleKeywords = [];
    listItems.forEach((li) => {
      articleKeywords.push(li.textContent);
    });

    const outputPath = `blog/${entry.replace('_', '/').replace('.ejs.', '.')}`;
    const pageData = {
      title,
      description,
      keywords: [...articleKeywords, 'hyiromori', 'blog'].join(','),
    };
    convertTemplate('blog/article.ejs.html', outputPath, { ...data, ...pageData, content });

    return {
      relativePath,
      outputPath,
      title,
      articleKeywords,
      createdAt,
      updatedAt,
    };
  });

convertTemplate('blog/index.ejs.html', 'blog/index.html', { ...data, entries });
