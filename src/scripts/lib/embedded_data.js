const { imageFileBase64 } = require('./file');

const version = (new Date()).toISOString();

const DefaultData = {
  imageFileBase64,
};

const SITE_DATA = {
  version,
};

const DEFAULT_PAGE_DATA = {
  title: 'Portfolio',
  description: 'Web系フルスタックエンジニア hyiromori のポートフォリオサイトです。',
  keywords: 'portfolio, hyiromori',
};

const getEmbeddedData = (page = {}, file = {}) => {
  const data = Object.assign(
    {},
    DefaultData,
    {
      page: Object.assign({}, DEFAULT_PAGE_DATA, page),
      site: SITE_DATA,
      file,
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
