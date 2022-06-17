import { Post } from "../util/post";
import { renderFooter, renderToHtml } from "./common";
import React from "react";
import { BaseURL } from "../util/definition";

const getTitlePrefix = (post: Post): string => {
  switch (post.type) {
    case "article":
      return "【記事】";
    case "zenn":
      return "【Zenn】";
    case "slide":
      return "【スライド】";
    case "scrap":
      return "【スクラップ】";
    default:
      throw new Error(`Unknown type: ${post.type}`);
  }
};

export const renderBlogIndex = (posts: Post[]): string => {
  const postsPerMonthly: { [month: string]: Post[] } = {};
  posts.forEach((post) => {
    const yearMonth = post.createdAt.substring(0, 7);
    postsPerMonthly[yearMonth] = postsPerMonthly[yearMonth] ?? [];
    postsPerMonthly[yearMonth].push(post);
  });
  const months = Object.keys(postsPerMonthly).sort().reverse();

  const script = `
    document.addEventListener('DOMContentLoaded', () => {
      document.addEventListener('click', (event) => {
        const element = event.target;
        if (element == null || element.className !== "checkbox-shown") return;
        const show = element.checked;
        Array.from(document.getElementsByClassName(element.id)).forEach((li) => {
          li.style.display = show ? "list-item" : "none";
        });
      });
    });
  `;

  const title = "mryhryki's blog";
  const description = "Web技術に関する記事・スライド・スクラップ、Zennのバックアップ、個人的なメモなど";

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
        <meta property="og:url" content={`${BaseURL}/blog/`} />
        <meta property="og:site_name" content="mryhryki's blog" />
        <meta property="og:locale" content="ja-JP" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${BaseURL}/assets/image/share_image.jpg`} />
        <meta name="twitter:site" content="@mryhryki" />

        <link rel="stylesheet" href="/assets/css/base.css" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <link rel="apple-touch-icon" type="image/png" href="./assets/image/icon_180x180.png" />
      </head>
      <body className="wrapper dark-theme">
        <h1>{title}</h1>
        <p style={{ textAlign: "center" }}>
          Web技術に関する記事・スライド・スクラップ（読んだ記事の記録）、
          <a href="https://zenn.dev/mryhryki">Zennのバックアップ</a>、個人的なメモなど
        </p>
        <form style={{ textAlign: "center" }}>
          <label style={{ marginRight: "1rem" }}>
            <input type="checkbox" id="post-article" className="checkbox-shown" defaultChecked />
            記事
          </label>
          <label style={{ marginRight: "1rem" }}>
            <input type="checkbox" id="post-zenn" className="checkbox-shown" defaultChecked />
            Zenn
          </label>
          <label style={{ marginRight: "1rem" }}>
            <input type="checkbox" id="post-slide" className="checkbox-shown" defaultChecked />
            スライド
          </label>
          <label style={{ marginRight: "1rem" }}>
            <input type="checkbox" id="post-scrap" className="checkbox-shown" defaultChecked />
            スクラップ
          </label>
        </form>

        {months.map((month) => (
          <>
            <h2>{month}</h2>
            <ul>
              {postsPerMonthly[month].map((post) => (
                <li key={post.id} className={`post-${post.type}`}>
                  {post.createdAt.substring(0, 10)}{" "}
                  <a href={post.url.replace(BaseURL, "")}>
                    {getTitlePrefix(post)}
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ))}

        <footer>
          <span>
            {"©2021 "}
            <a style={{ color: "inherit" }} href={BaseURL}>mryhryki</a>
          </span>
        </footer>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </>
  );
};
