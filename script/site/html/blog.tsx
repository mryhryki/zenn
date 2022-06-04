import { Post } from "../util/post";
import { convert } from "@mryhryki/markdown";
import React from "react";
import { renderHeadTag, renderToHtml } from "./common";
import { BaseURL } from "../util/definition";

export const renderBlogPost = (post: Post): string =>
  renderToHtml(
    <>
      {renderHeadTag({
        url: post.url,
        siteName: "mryhryki's blog",
        title: post.title,
        description: "Web技術に関する記事・スライド・スクラップ、個人的なメモなど",
        canonical: post.canonical,
        useSyntaxHighlight: true,
      })}
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
        <footer>
          <a href="/blog/">一覧</a>
          <span>
            © 2021{" "}
            <a style={{ color: "inherit" }} href={BaseURL}>
              mryhryki
            </a>
          </span>
        </footer>
      </body>
    </>
  );
