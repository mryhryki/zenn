const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const { convertMarkdown } = require('./lib/file');

const API_KEY = process.env.HATENA_BLOG_API_KEY;
const ENDPOINT = `https://hyrm:${API_KEY}@blog.hatena.ne.jp/hyrm/hyiromori.hatenablog.com/atom`;

const THIS_DIR = path.resolve(__dirname);
const PUBLISH_DIR = path.join(THIS_DIR, '../blog');
const JSON_FILE = path.join(THIS_DIR, 'published.json');

const PUBLISH_LIST = fs.readdirSync(PUBLISH_DIR);
const DEFINITION = JSON.parse(fs.readFileSync(JSON_FILE));

const create = async (fileName, title, markdown) => {
  const xmlText = (`
      <?xml version="1.0" encoding="utf-8"?>
      <entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
        <title>${title}</title>
        <content type="text/plain">${markdown}</content>
      </entry>
    `).trim();
  const postOption = {
    method: 'POST',
    headers: { 'Content-Type': 'text/x-markdown' },
    body: xmlText,
  };
  const response = await fetch(`${ENDPOINT}/entry`, postOption);
  if (!response.ok) throw new Error('Response is not OK.');
  const responseXmlText = await response.text();
  const xml = await (new Promise((resolve, reject) => {
    xml2js.parseString(responseXmlText, (error, result) => {
      if (error != null) reject(error);
      resolve(result);
    });
  }))();
  console.debug(xml);
};

const update = (fileName, title, markdown, hash) => (new Promise((resolve, reject) => {
  const fileName = 'TODO';

  return {
    [fileName]: {
      id: '',
      hash: '',
    },
  };
}));

Promise.all(
  PUBLISH_LIST.slice(0, 1).map((publishFile) => new Promise((resolve, reject) => {
    const { markdown, pageData } = convertMarkdown(publishFile);
    const { title } = pageData;

    const def = Object.assign({}, DEFINITION[publishFile]);
    if (def.id != null) {
      return update(title, markdown, def.hash);
    } else {
      return create(title, markdown);
    }
  })),
).then((results) => {
  const newDefinition = {};
  results.forEach((result) => {
    Object.assign(newDefinition, result);
  });
  fs.writeFileSync(JSON_FILE, JSON.stringify(DEFINITION, null, '  '));
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
