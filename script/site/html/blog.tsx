import { Post } from "../../common/post/parse";
import { convert } from "@mryhryki/markdown";
import React from "react";
import { renderFooter, renderToHtml } from "./common";
import { BaseURL } from "../../common/definition";

export const renderBlogPost = (post: Post): string => {
  const { title } = post;
  const siteName = "mryhryki's blog";
  const description = "個人的なメモです";

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
        <meta property="og:url" content={post.url} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="ja-JP" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${BaseURL}/assets/image/share_image.jpg`} />
        <meta name="twitter:site" content="@mryhryki" />

        <link rel="stylesheet" href="/assets/css/base.css" />
        <link rel="stylesheet" href="/assets/css/highlightjs.css" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <link rel="apple-touch-icon" type="image/png" href="./assets/image/icon_180x180.png" />

        {post.canonical != null && <link rel="canonical" href={post.canonical} />}
      </head>
      <body className="wrapper dark-theme">
        <h1>{post.title}</h1>
        {post.canonical != null && (
          <p style={{ textAlign: "center", fontSize: "12px" }}>
            （※この記事は <a href={post.canonical}>別媒体に投稿した記事</a> のバックアップです。
            <a
              href="https://developer.mozilla.org/ja/docs/Web/HTML/Attributes/rel#attr-canonical"
              target="_blank"
              rel="noopener noreferrer"
            >
              canonical
            </a>{" "}
            も設定しています）
          </p>
        )}
        <div dangerouslySetInnerHTML={{ __html: convert(post.markdown).html }} />
        {renderFooter(post)}
      </body>
    </>
  );
};
