import { Post } from "../util/post";
import { renderGiscus, renderHeadTag, renderToHtml } from "./common";
import { convert } from "@mryhryki/markdown";
import React from "react";
import { BaseURL } from "../util/definition";

export const renderScrap = (post: Post): string =>
  renderToHtml(
    <>
      {renderHeadTag({
        url: post.url,
        siteName: "mryhryki's blog",
        title: post.title,
        description: "Web技術や個人的なメモなどを投稿しています。",
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
        <footer>
          <a href="/blog/">一覧</a>
          <span>
            {" © 2021 "}
            <a style={{ color: "inherit" }} href={BaseURL}>
              mryhryki
            </a>
          </span>
        </footer>
        <div style={{textAlign: "right"}}>
          <button data-copytext={`### ${post.title}\n\n${post.markdown}`}>Copy Markdown</button>
        </div>
        <script src="/assets/script/copy_to_clipboard.js" />
        {renderGiscus()}
      </body>
    </>
  );