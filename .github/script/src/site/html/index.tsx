import { Post } from "../../common/post/parse";
import { renderToHtml } from "./common";
import React from "react";
import { BaseURL } from "../../common/definition";
import { CharacterRegExpValue } from "../../common/character";

const getTitlePrefix = (post: Post): string => {
  switch (post.type) {
    case "articles":
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
  const description = "ブログ一覧";

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
        <meta property="og:image" content={`${BaseURL}/assets/image/share_image.jpeg`} />
        <meta property="og:url" content={`${BaseURL}/blog/`} />
        <meta property="og:site_name" content="mryhryki's blog" />
        <meta property="og:locale" content="ja-JP" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${BaseURL}/assets/image/share_image.jpeg`} />
        <meta name="twitter:site" content="@mryhryki" />

        <link rel="stylesheet" href="/assets/css/base.css" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .post-type-checkbox-label {
                align-items: center;
                display: flex;
                padding: 0.5rem;
              }
            `,
          }}
        ></style>

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <link rel="apple-touch-icon" type="image/png" href="https://mryhryki.com/assets/image/icon_180x180.png" />
      </head>
      <body className="wrapper dark-theme">
        <h1>{title}</h1>
        <details style={{ margin: "0 0 1rem 0" }}>
          <summary style={{ textAlign: "center", textDecoration: "underline" }}>このブログについて</summary>
          <div>
            <p>このブログの投稿は、以下の4種類に分類しています。</p>
            <ol>
              <li>記事: 公開することを前提として書いたもので、他媒体のバックアップがほとんどです。</li>
              <li>メモ: 主に自分用のメモですが、誰かの役に立つかもと思い公開しています。</li>
              <li>スクラップ: 自分が読んだ記事の記録ですが、こちらも誰かの役に立つかも思い公開しています。</li>
              <li>スライド: 発表用資料です。</li>
            </ol>
            <p>
              メモ、スクラップは他人に読まれることをあまり意識していない点にご注意ください。
              <br />
              間違いや感想などありましたら{" "}
              <a href="https://github.com/mryhryki/portfolio/issues/new">GitHub の Issue</a> か{" "}
              <a href="mailto:mryhryki@gmail.com">メール</a> でお伝えいただけますと幸いです。
            </p>
          </div>
        </details>
        <div style={{ textAlign: "center", margin: "0.5rem 0" }}>
          <label>
            {"キーワード検索 "}
            <input id="keyword" type="text" />
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <label htmlFor="articles-checkbox" className="post-type-checkbox-label">
            <input id="articles-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
            記事
          </label>
          <label htmlFor="memo-checkbox" className="post-type-checkbox-label">
            <input id="memo-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
            メモ
          </label>
          <label htmlFor="scrap-checkbox" className="post-type-checkbox-label">
            <input id="scrap-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
            スクラップ
          </label>
          <label htmlFor="slide-checkbox" className="post-type-checkbox-label">
            <input id="slide-checkbox" className="post-type-checkbox" type="checkbox" defaultChecked />
            スライド
          </label>
        </div>

        <div style={{ textAlign: "left" }}>
          {months.map((month) => {
            const posts = postsPerMonthly[month];
            return (
              <React.Fragment key={month}>
                <h2 id={month} className="month-title">
                  <a href={`#${month}`}>{month}</a>
                </h2>
                <ul className="posts">
                  {posts.map((post) => (
                    <li
                      key={post.id}
                      className={`post-item ${post.type}`}
                      data-month={month}
                      data-posttype={post.type}
                      data-search={
                        `${post.id} ${post.title} ${post.markdown}`
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
                document.getElementById("articles-checkbox").checked = checks.length === 0 || checks.includes("articles");
                document.getElementById("memo-checkbox").checked = checks.length === 0 || checks.includes("memo");
                document.getElementById("scrap-checkbox").checked = checks.length === 0 || checks.includes("scrap");
                document.getElementById("slide-checkbox").checked = checks.length === 0 || checks.includes("slide");
              };

              const getCurrentState = () => ({
                keyword: document.getElementById("keyword").value,
                checks: [
                  document.getElementById("articles-checkbox").checked ? "articles" : null,
                  document.getElementById("memo-checkbox").checked ? "memo" : null,
                  document.getElementById("scrap-checkbox").checked ? "scrap" : null,
                  document.getElementById("slide-checkbox").checked ? "slide" : null,
                ].filter((check) => check != null),
              });

              const setStateToUrl = (state) => {
                const { keyword, checks } = state;
                const url = new URL(window.location.href);
                const setSearchParams = (key, val) => val === "" ? url.searchParams.delete(key) : url.searchParams.set(key, val);
                setSearchParams("keyword", keyword.trim());
                setSearchParams("check", 0 < checks.length && checks.length < 4 ? checks.join(".") : "");
                window.history.replaceState({}, null, url.toString());
              };

              document.addEventListener("DOMContentLoaded", () => {
                const onChange = () => {
                  const months = new Set([]);
                  const state = getCurrentState();
                  const keywords = normalizeText(state.keyword).split(" ").map((keyword) => keyword.trim()).filter((keyword) => keyword !== "");
                  setStateToUrl(state);
                  Array.from(document.getElementsByClassName("post-item")).forEach((element) => {
                    const { posttype: type, search, month } = element.dataset;
                    const show = state.checks.includes(type) && keywords.every((keyword) => search.includes(keyword));
                    element.style.display = show ? "list-item" : "none";
                    if (show) months.add(month);
                  });
                  Array.from(document.getElementsByClassName("month-title")).forEach((element) => {
                    element.style.display = months.has(element.id) ? "block" : "none";
                  });
                };

                let currentKeyword = null;
                document.getElementById("keyword").addEventListener("keyup", () => {
                  currentKeyword = document.getElementById("keyword").value;
                  setTimeout(() => {
                    if (currentKeyword === document.getElementById("keyword").value) {
                      onChange();
                    }
                  }, 200);
                });

                document.getElementById("articles-checkbox").addEventListener("change", onChange);
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
