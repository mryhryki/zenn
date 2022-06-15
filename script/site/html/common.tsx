import React from "react";
import ReactDOMServer from "react-dom/server";

export const renderToHtml = (element: React.ReactElement): string => {
  const html = ReactDOMServer.renderToStaticMarkup(element);
  return `<!doctype html><html lang="ja">${html}</html>`;
};

export const renderGiscus = () =>
  <script
    src="https://giscus.app/client.js"
    data-repo="mryhryki/portfolio"
    data-repo-id="MDEwOlJlcG9zaXRvcnkxMTU5NzU1NjM="
    data-category="Announcements"
    data-category-id="DIC_kwDOBumli84COoZK"
    data-mapping="pathname"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="bottom"
    data-theme="dark_dimmed"
    data-lang="ja"
    data-loading="lazy"
    crossOrigin="anonymous"
    async
  ></script>

