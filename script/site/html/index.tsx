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
    const checkBoxClassName = "checkbox-shown";
    const checks = { article: false, zenn: false, slide: false, scrap: false };

    document.addEventListener('DOMContentLoaded', () => {
      const checkQueryParamText = new URL(window.location.href).searchParams.get("check") || ""
      const checkByQueryParams = checkQueryParamText === "" ? Object.keys(checks) : checkQueryParamText.split(",");
      checkByQueryParams.forEach((name) => checks[name] = true);

      const update = () => {
        const url = new URL(window.location.href);
        url.searchParams.set("check", Object.keys(checks).filter((key) => checks[key]).join(","));
        window.history.replaceState({}, null, url.toString());
        Array.from(document.querySelectorAll(\`input.\${checkBoxClassName}\`)).forEach((checkbox) => {
          checkbox.checked = checks[checkbox.name] ? "checked" : "";
        });
        Array.from(document.querySelectorAll("li.post-item")).forEach((li) => {
          li.style.display = checks[li.dataset.type] ? "list-item" : "none";
        });
      }
      update();

      document.addEventListener('click', (event) => {
        const element = event.target;
        if (element == null || !element.classList.contains(checkBoxClassName)) return;
        checks[element.name] = element.checked;
        update();
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
          <a href="https://zenn.dev/mryhryki">Zenn</a>のバックアップ、個人的なメモなど
        </p>
        <form style={{ textAlign: "center" }}>
          <label style={{ marginRight: "1rem" }}>
            <input type="checkbox" name="article" className="checkbox-shown" defaultChecked />
            記事
          </label>
          <label style={{ marginRight: "1rem" }}>
            <input type="checkbox" name="zenn" className="checkbox-shown" defaultChecked />
            Zenn
          </label>
          <label style={{ marginRight: "1rem" }}>
            <input type="checkbox" name="slide" className="checkbox-shown" defaultChecked />
            スライド
          </label>
          <label style={{ marginRight: "1rem" }}>
            <input type="checkbox" name="scrap" className="checkbox-shown" defaultChecked />
            スクラップ
          </label>
        </form>

        {months.map((month) => (
          <>
            <h2 id={month}><a href={`#${month}`}>{month}</a></h2>
            <ul>
              {postsPerMonthly[month].map((post) => (
                <li key={post.id} className="post-item" data-type={post.type}>
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
