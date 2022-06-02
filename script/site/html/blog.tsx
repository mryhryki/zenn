import { Post } from "../util/post";
import { convert } from "@mryhryki/markdown";
import React from "react";
import { renderHeadTag, renderToHtml } from "./common";

export const renderBlogPost = (post: Post): string =>
  renderToHtml(
    <>
      {renderHeadTag({
        url: post.url,
        siteName: "mryhryki's blog",
        title: post.title,
        description: "Web技術に関する記事・スライド・読了記録、個人的なメモなど",
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
            <a style={{ color: "inherit" }} href="https://mryhryki.com/">
              mryhryki
            </a>
          </span>
        </footer>
      </body>
    </>
  );

export const renderBlogIndex = (posts: Post[]): string =>
  renderToHtml(
    <>
      {renderHeadTag({
        url: "https://mryhryki.com/blog/",
        siteName: "mryhryki's blog",
        title: "mryhryki's blog",
        description: "Web技術に関する記事・スライド・読了記録、個人的なメモなど",
      })}
      <body className="wrapper dark-theme">
        <h1>mryhryki&apos;s blog</h1>
        <p style={{ textAlign: "center" }}>Web技術に関する記事・スライド・読了記録、個人的なメモなど</p>

        {posts.map(({ id, title, relativeUrl, createdAt, canonical }, index) => (
          <React.Fragment key={index}>
            {(index === 0 || createdAt.substring(0, 7) !== posts[index - 1].createdAt.substring(0, 7)) && (
              <h2>{createdAt.substring(0, 7)}</h2>
            )}
            <p>
              <a href={relativeUrl}>{title}</a>
              <br />
              <span style={{ fontSize: "12px" }}>&#x1f4dd;{createdAt.substring(0, 10)}</span>
              {canonical != null && (
                <span style={{ fontSize: "12px" }}>
                  {" (View on "}
                  <a href={canonical} target="_blank" rel="noopener noreferrer">
                    {new URL(canonical).host}
                  </a>
                  )
                </span>
              )}
            </p>
          </React.Fragment>
        ))}
        <footer>
          <a href="/blog/">一覧</a>
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
