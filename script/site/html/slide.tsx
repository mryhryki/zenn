import React from "react";
import ReactDOMServer from "react-dom/server";
import { convert } from "@mryhryki/markdown";
import { Post } from "../util/post";
import { renderHeadTag } from "./common";

const renderToHtml = (element: React.ReactElement): string => {
  const html = ReactDOMServer.renderToStaticMarkup(element);
  return `<!doctype html>${html}`;
};

export const renderSlide = (markdown: string): string => {
  const { title } = convert(markdown);
  const description = "DESCRIPTION";
  const url = "https://mryhryki.com/";
  const siteName = title;

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
        <link rel="stylesheet" href="/assets/css/slide.css" />

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
      <body style={{ margin: 0 }}>
        <textarea
          id="source"
          value={markdown}
          readOnly
          style={{ width: "calc(100vw - 16px)", height: "calc(100vh - 16px)", fontSize: "16px", padding: "8px" }}
        />
        <script src="/assets/script/remark-latest.min.js" />
        <script dangerouslySetInnerHTML={{ __html: "var slideshow = remark.create({ ratio: '16:9' });" }} />
      </body>
    </html>
  );
};

export const renderSlideIndex = (posts: Post[]): string =>
  renderToHtml(
    <>
      {renderHeadTag({
        url: "https://mryhryki.com/slide/",
        siteName: "mryhryki's slide",
        title: "mryhryki's slide",
        description: "スライド置き場です。",
      })}
      <body className="wrapper dark-theme">
        <h1>mryhryki&apos;s slide</h1>
        <p style={{ textAlign: "center" }}>スライド置き場です。</p>

        {posts.map(({ id, title, createdAt }, index) => (
          <React.Fragment key={index}>
            {(index === 0 || createdAt.substring(0, 7) !== posts[index - 1].createdAt.substring(0, 7)) && (
              <h2>{createdAt.substring(0, 7)}</h2>
            )}
            <p>
              <a href={`/slide/${id}.html`}>{title}</a>
              <br />
              <span style={{ fontSize: "12px" }}>&#x1f4dd;{createdAt.substring(0, 10)}</span>
            </p>
          </React.Fragment>
        ))}
        <footer>
          <span>
            © 2021{" "}
            <a style={{ color: "inherit" }} href="https://mryhryki.com/">
              mryhryki
            </a>
          </span>
        </footer>
      </body>
    </>
  );
