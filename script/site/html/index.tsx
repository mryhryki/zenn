import { Post } from "../../common/post/parse";
import { renderToHtml } from "./common";
import React from "react";
import { BaseURL } from "../../common/definition";

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
        <style dangerouslySetInnerHTML={{
          __html: `
          li.post-item {
            display: none;
          }

          input#article-checkbox:checked ~ div > ul.posts > li.post-item.article,
          input#zenn-checkbox:checked ~ div > ul.posts > li.post-item.zenn,
          input#slide-checkbox:checked ~ div > ul.posts > li.post-item.slide,
          input#scrap-checkbox:checked ~ div > ul.posts > li.post-item.scrap {
            display: list-item;
          }

          h2.month {
            display: none;
          }

          input#article-checkbox:checked ~ div > h2.month.article,
          input#zenn-checkbox:checked ~ div > h2.month.zenn,
          input#slide-checkbox:checked ~ div > h2.month.slide,
          input#scrap-checkbox:checked ~ div > h2.month.scrap {
            display: block;
          }
        `
        }} />

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

        <div style={{ textAlign: "center" }}>
          <input id="article-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
          <label htmlFor="article-checkbox" style={{ marginRight: "1rem" }}>記事</label>
          <input id="zenn-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
          <label htmlFor="zenn-checkbox" style={{ marginRight: "1rem" }}>Zenn</label>
          <input id="slide-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
          <label htmlFor="slide-checkbox" style={{ marginRight: "1rem" }}>スライド</label>
          <input id="scrap-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
          <label htmlFor="scrap-checkbox" style={{ marginRight: "1rem" }}>スクラップ</label>

          <div style={{ textAlign: "left" }}>
            {months.map((month) => {
              const posts = postsPerMonthly[month];
              const types = Array.from(new Set(posts.map(({ type }) => type))).sort();
              return (
                <>
                  <h2 id={month} className={`month ${types.join(" ")}`}><a href={`#${month}`}>{month}</a></h2>
                  <ul className="posts">
                    {postsPerMonthly[month].map((post) => (
                      <li key={post.id} className={`post-item ${post.type}`}>
                        {post.createdAt.substring(0, 10)}{" "}
                        <a href={post.url.replace(BaseURL, "")}>
                          {getTitlePrefix(post)}
                          {post.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              );
            })}
          </div>
        </div>

        <footer>
          <span>
            {"©2021 "}
            <a style={{ color: "inherit" }} href={BaseURL}>mryhryki</a>
          </span>
        </footer>
        <script dangerouslySetInnerHTML={{
          __html: `
          const CheckBoxSuffix = "-checkbox";
          const BreakChar = ".";

          document.addEventListener('DOMContentLoaded', () => {
            const getCheckBoxes = () => Array.from(document.querySelectorAll("input.post-type-checkbox"))
            const getCheckedKeys = () => getCheckBoxes().filter((input) => input.checked).map((input) => input.id.replace(CheckBoxSuffix, ""));

            const checkQueryParamText = new URL(window.location.href).searchParams.get("check") || ""
            const checkedNames = checkQueryParamText !== "" ? checkQueryParamText.split(BreakChar) : getCheckBoxes().map((input) => input.id.replace(CheckBoxSuffix, ""));
            getCheckBoxes().forEach((checkBox) => {
              const name = checkBox.id.replace(CheckBoxSuffix, "");
              checkBox.checked = checkedNames.includes(name) ? "checked" : "";
            });

            getCheckBoxes().forEach((checkBox) => {
              checkBox.addEventListener('click', (event) => {
                const url = new URL(window.location.href);
                const elementCount = getCheckBoxes().length;
                const checkedKeys = getCheckedKeys();
                if (elementCount === checkedKeys.length || checkedKeys.length === 0) {
                  url.searchParams.delete("check");
                } else {
                  url.searchParams.set("check", getCheckedKeys().join(BreakChar));
                }
                window.history.replaceState({}, null, url.toString());
              });
            });
          });
        `
        }} />
      </body>
    </>
  );
};
