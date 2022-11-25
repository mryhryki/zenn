import { Post } from "../../common/post/parse";
import { renderFooter, renderToHtml } from "./common";
import { convert } from "@mryhryki/markdown";
import React from "react";
import { BaseURL } from "../../common/definition";

export const renderScrap = (post: Post): string => {
  const url = post.url;
  const siteName = "mryhryki's scrap";
  const title = post.title;
  const description = "主にWeb関連の記事のスクラップです。";
  const canonical = post.canonical;
  const useSyntaxHighlight = true;

  return renderToHtml(
    <>
      <head>
        <meta charSet="UTF-8" />
        <title>{title}</title>
        <meta content={title} name="title" />
        <meta content={description} name="description" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/assets/image/icon_192x192.png" type="image/png" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${BaseURL}/assets/image/share_image.jpg`} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="ja-JP" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${BaseURL}/assets/image/share_image.jpg`} />
        <meta name="twitter:site" content="@mryhryki" />

        <link rel="stylesheet" href="https://mryhryki.com/assets/css/base.css" />
        {useSyntaxHighlight && <link rel="stylesheet" href="https://mryhryki.com/assets/css/highlightjs.css" />}

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <link rel="apple-touch-icon" type="image/png" href="https://mryhryki.com/assets/image/icon_180x180.png" />

        {canonical != null && <link rel="canonical" href={canonical} />}
      </head>
      <body className="wrapper dark-theme">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: convert(post.markdown).html }} />
        {renderFooter(post)}
      </body>
    </>
  );
};
