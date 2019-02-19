const { componentFile } = require('./file');

const version = (new Date()).toISOString();

const SITE_DATA = {
  version,
};

const DEFAULT_PAGE_DATA = {
  title: 'Portfolio',
  description: 'Web系エンジニア hyiromori のポートフォリオサイトです。',
  keywords: 'portfolio, hyiromori',
};

const getEmbeddedData = (page = {}) => {
  const data = Object.assign(
    { componentFile },
    {
      page: Object.assign({}, DEFAULT_PAGE_DATA, page),
      site: SITE_DATA,
    },
  );
  if (data.page.metaTitle == null) {
    data.page.metaTitle = `${data.page.title} | hyiromori`;
  }
  return data;
};

module.exports = {
  getEmbeddedData,
};
