import React from "react";
import ReactDOMServer from "react-dom/server";

const renderToHtml = (element: React.ReactElement): string => {
  const html = ReactDOMServer.renderToStaticMarkup(element);
  return `<!doctype html>${html}`;
};

export const renderSlide = (html: string, css: string): string => {
  const title = "TITLE";
  const description = "DESCRIPTION";
  const url = "https://mryhryki.com/";
  const siteName = "SITE_NAME";

  const script = `
    const NumberPattern = new RegExp('[1-9][0-9]*$')
    const HashPattern = new RegExp('^#[1-9][0-9]*$')
    const MaxSlideNumber = Array.from(document.getElementsByTagName("section"))
      .filter((section) => NumberPattern.test(section.id))
      .map((section) => parseInt(section.id, 10))
      .reduce((max, current) => Math.max(max, current), 1)
    const checkRange = (slideNumber) => Math.min(Math.max(1, slideNumber), MaxSlideNumber)
    document.addEventListener('keypress', (event) => {
      const { shiftKey: shift, key } = event
      const currentSlideNumber = HashPattern.test(location.hash) ? parseInt(location.hash.substring(1)) || 1 : 1
      if ((!shift && key === "Enter") || key === "n") {
        window.location = \`#\${checkRange(currentSlideNumber + 1)}\`
      } else if ((shift && key === "Enter") || key === "p") {
        window.location = \`#\${checkRange(currentSlideNumber - 1)}\`
      }
    })
  `;

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

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/css/base.css" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <link rel="apple-touch-icon" type="image/png" href="./assets/image/icon_180x180.png" />

        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body dangerouslySetInnerHTML={{ __html: html }} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </html>
  );
};
