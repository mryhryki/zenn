import React from "react";
import ReactDOMServer from "react-dom/server";

const renderToHtml = (element: React.ReactElement): string => {
  const html = ReactDOMServer.renderToStaticMarkup(element);
  return `<!doctype html>${html}`;
};

export const renderSlide = (markdown: string): string => {
  const title = "TITLE";
  const description = "DESCRIPTION";
  const url = "https://mryhryki.com/";
  const siteName = "SITE_NAME";

  return renderToHtml(
    <html>
      <head>
        <meta charSet="UTF-8" />
        <base target="_blank" />
        <title>{title}</title>
        <meta content={title} name="title" />
        <meta content={description} name="description" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/assets/image/icon_192x192.png" type="image/png" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://mryhryki.com/assets/image/share_image.jpg" />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="ja-JP" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://mryhryki.com/assets/image/share_image.jpg" />
        <meta name="twitter:site" content="@mryhryki" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <link rel="apple-touch-icon" type="image/png" href="./assets/image/icon_180x180.png" />
      </head>
      <body>
        <textarea id="source" value={markdown} readOnly style={{ display: "none" }} />
        <script src="https://remarkjs.com/downloads/remark-latest.min.js" />
        <script dangerouslySetInnerHTML={{ __html: "var slideshow = remark.create({ ratio: '16:9' });" }} />
      </body>
    </html>
  );
};
