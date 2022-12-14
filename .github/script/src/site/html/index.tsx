import { Post } from "../../common/post/parse";
import { renderToHtml } from "./common";
import React from "react";
import { BaseURL } from "../../common/definition";
import { CharacterRegExpValue } from "../../common/character";

const getTitlePrefix = (post: Post): string => {
  switch (post.type) {
    case "article":
      return "【記事】";
    case "memo":
      return "【メモ】";
    case "scrap":
      return "【スクラップ】";
    case "slide":
      return "【スライド】";
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
  const description = "記事・メモ・スライド・スクラップのインデックス";

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
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* TODO */
            `,
          }}
        />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <link rel="apple-touch-icon" type="image/png" href="https://mryhryki.com/assets/image/icon_180x180.png" />
      </head>
      <body className="wrapper dark-theme">
        <h1>{title}</h1>
        <div style={{ textAlign: "center", margin: "0.5rem 0" }}>
          <label>
            {"キーワード "}
            <input id="keyword" type="text" />
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <input id="article-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
          <label htmlFor="article-checkbox" style={{ marginRight: "1rem" }}>
            記事
          </label>
          <input id="memo-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
          <label htmlFor="memo-checkbox" style={{ marginRight: "1rem" }}>
            メモ
          </label>
          <input id="scrap-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
          <label htmlFor="scrap-checkbox" style={{ marginRight: "1rem" }}>
            スクラップ
          </label>
          <input id="slide-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
          <label htmlFor="slide-checkbox" style={{ marginRight: "1rem" }}>
            スライド
          </label>
        </div>

        <div style={{ textAlign: "left" }}>
          {months.map((month) => {
            const posts = postsPerMonthly[month];
            return (
              <React.Fragment key={month}>
                <h2 id={month}>
                  <a href={`#${month}`}>{month}</a>
                </h2>
                <ul className="posts">
                  {posts.map((post) => (
                    <li
                      key={post.id}
                      className={`post-item ${post.type}`}
                      data-posttype={post.type}
                      data-search={
                        post.markdown
                          .replace(new RegExp(`[^${CharacterRegExpValue}]+`, "g"), " ")
                          .trim()
                          .normalize("NFKD")
                          .toLowerCase()
                          .replace(/[\u30A1-\u30FA]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60)) // カタカナ -> ひらがな
                      }
                    >
                      {`${post.createdAt.substring(0, 10)} ${getTitlePrefix(post)} `}
                      <a href={post.url.replace(BaseURL, "")}>{post.title}</a>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            );
          })}
        </div>

        <footer>
          <span>
            {"RSS: "}
            <a href="/blog/rss_article.xml">Article</a> <a href="/blog/rss_memo.xml">Memo</a>{" "}
            <a href="/blog/rss_scrap.xml">Scrap</a>
            {" ©2021 "}
            <a href={BaseURL}>mryhryki</a>
          </span>
        </footer>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const normalizeText = (text) => text
                .normalize("NFKD")
                .toLowerCase()
                .replace(/[\u30A1-\u30FA]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60)); // カタカナ -> ひらがな

              const init = () => {
                const url = new URL(window.location.href);
                const checks = (url.searchParams.get("check") ?? "").split(".").map((check) => check.trim()).filter((check) => check !== "");
                document.getElementById("keyword").value = url.searchParams.get("keyword") ?? "";
                document.getElementById("article-checkbox").checked = checks.length === 0 || checks.includes("article");
                document.getElementById("memo-checkbox").checked = checks.length === 0 || checks.includes("memo");
                document.getElementById("scrap-checkbox").checked = checks.length === 0 || checks.includes("scrap");
                document.getElementById("slide-checkbox").checked = checks.length === 0 || checks.includes("slide");
              };

              const getCurrentState = () => ({
                keyword: document.getElementById("keyword").value,
                checks: [
                  document.getElementById("article-checkbox").checked ? "article" : null,
                  document.getElementById("memo-checkbox").checked ? "memo" : null,
                  document.getElementById("scrap-checkbox").checked ? "scrap" : null,
                  document.getElementById("slide-checkbox").checked ? "slide" : null,
                ].filter((check) => check != null),
              });

              const setStateToUrl = (state) => {
                const { keyword, checks } = state;
                const url = new URL(window.location.pathname, window.location.href);
                if (keyword.trim() !== "") url.searchParams.set("keyword", keyword);
                if (0 < checks.length && checks.length < 4) url.searchParams.set("check", checks.join("."));
                window.history.replaceState({}, null, url.toString());
              };

              document.addEventListener("DOMContentLoaded", () => {
                const onChange = () => {
                  const state = getCurrentState();
                  const { checks } = state;
                  const keywords = normalizeText(state.keyword).split(" ").map((keyword) => keyword.trim()).filter((keyword) => keyword !== "");
                  setStateToUrl(state);
                  Array.from(document.getElementsByClassName("post-item")).forEach((element) => {
                    const { posttype: type, search } = element.dataset;
                    const show = checks.includes(type) && keywords.every((keyword) => search.includes(keyword));
                    element.style.display = show ? "list-item" : "none";
                  });
                };

                let currentKeyword = null;
                document.getElementById("keyword").addEventListener("keyup", () => {
                  currentKeyword = document.getElementById("keyword").value;
                  console.debug(currentKeyword);
                  setTimeout(() => {
                    if (currentKeyword === document.getElementById("keyword").value) {
                      onChange();
                    }
                  }, 200);
                });

                document.getElementById("article-checkbox").addEventListener("change", onChange);
                document.getElementById("memo-checkbox").addEventListener("change", onChange);
                document.getElementById("scrap-checkbox").addEventListener("change", onChange);
                document.getElementById("slide-checkbox").addEventListener("change", onChange);

                init();
                onChange();
              });
            `,
          }}
        />
      </body>
    </>
  );
};
