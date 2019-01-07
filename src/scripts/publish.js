const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const xml2js = require('xml2js');

const API_KEY = process.env.HATENA_BLOG_API_KEY;
const ENDPOINT = `https://hyrm:${API_KEY}@blog.hatena.ne.jp/hyrm/hyiromori.hatenablog.com/atom`;

const THIS_DIR = path.resolve(__dirname);
const PUBLISH_DIR = path.join(THIS_DIR, '../blog/publish');
const JSON_FILE = path.join(THIS_DIR, 'published.json');

const PUBLISH_LIST = fs.readdirSync(PUBLISH_DIR);
const DEFINITION = JSON.parse(fs.readFileSync(JSON_FILE));

PUBLISH_LIST.slice(0, 1).forEach((publishFile) => {
  const def = Object.assign({}, DEFINITION[publishFile]);
  if (def.id != null) {
    // TODO: Update
  } else {
    const title = 'テスト投稿';
    const content = '## AtomPub のテスト投稿です。';
    const xmlText = (`
      <?xml version="1.0" encoding="utf-8"?>
      <entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
        <title>${title}</title>
        <content type="text/plain">${content}</content>
      </entry>
    `).trim();
    console.debug(xmlText);
    const postOption = {
      method: 'POST',
      headers: { 'Content-Type': 'text/x-markdown' },
      body: xmlText,
    };
    fetch(`${ENDPOINT}/entry`, postOption).then((response) => {
      if (!response.ok) throw new Error('Response is not OK.');
      return response.text();
    }).then((xmlText) => {
      return new Promise((resolve, reject) => {
        xml2js.parseString(xmlText, (error, result) => {
          if (error != null) reject(error);
          resolve(result);
        });
      });
    }).then((xml) => {
      def.id = xml.entry.id[0];
    });
  }
  DEFINITION[publishFile] = def;
});

fs.writeFileSync(JSON_FILE, JSON.stringify(DEFINITION, null, '  '));


