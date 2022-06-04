import { Post } from "../util/post";
import { renderHeadTag, renderToHtml } from "./common";
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
        console.debug(show);
        Array.from(document.getElementsByClassName(element.id)).forEach((li) => {
          li.style.display = show ? "list-item" : "none";
        });
      });
    });
  `;

  return renderToHtml(
    <>
      {renderHeadTag({
        url: `${BaseURL}/blog/`,
        siteName: "mryhryki's blog",
        title: "mryhryki's blog",
        description: "Web技術に関する記事・スライド・スクラップ、Zennのバックアップ、個人的なメモなど",
      })}
      <body className="wrapper dark-theme">
        <h1>mryhryki&apos;s blog</h1>
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
          <a href="/blog/">一覧</a>
          <span>
            © 2021{" "}
            <a style={{ color: "inherit" }} href={BaseURL}>
              mryhryki
            </a>
          </span>
        </footer>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </>
  );
};
