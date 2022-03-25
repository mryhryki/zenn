import React from "react";
import { Post } from "../util/post";
import { convert } from "@mryhryki/markdown";
import { renderHeadTag, renderToHtml } from "./common";

export const renderReadingLogIndex = (posts: Post[]): string => {
  const title = "mryhryki's reading log";
  const description = "読んだ記事や本などの記録です。";

  const script = `
  document.addEventListener('DOMContentLoaded', () => {
    const id = new URL(location.href).hash.substring(1);
    if (id !== '') {
      const element = document.getElementById(id);
      if (element != null) {
        element.open = true;
      }
    }
    document.addEventListener('click', (event) => {
      const element = event.target;
      if (element == null) return;
      if (element.tagName === "SUMMARY" && element.id.length === 15) {
        history.replaceState(null, null, \`#\${element.id}\`);
      } else if (element.tagName === "BUTTON" && element.id === "open-all") {
        Array.from(document.getElementsByTagName('details')).forEach((details) => details.open = true)
      }
    });
  })`;

  return renderToHtml(
    <>
      {renderHeadTag({
        url: "https://mryhryki.com/reading_log/",
        siteName: title,
        title,
        description,
      })}
      <body className="wrapper dark-theme">
        <h1>{title}</h1>
        <p style={{ textAlign: "center" }}>{description}</p>
        <p style={{ textAlign: "center" }}>
          <button id="open-all">全て開く</button>
        </p>

        {posts.map(({ id, title, createdAt, markdown }, index) => (
          <React.Fragment key={index}>
            {(index === 0 || createdAt.substring(0, 7) !== posts[index - 1].createdAt.substring(0, 7)) && (
              <h2>{createdAt.substring(0, 7)}</h2>
            )}
            <details id={id} className="details-link">
              <summary id={id}>{title}</summary>
              <div dangerouslySetInnerHTML={{ __html: convert(markdown).html }} />
              <p>
                記録日: {createdAt.substring(0, 10)}{" "}
                <button data-copytext={`## ${title}\n\n${markdown}`}>Copy Markdown</button>
              </p>
            </details>
          </React.Fragment>
        ))}
        <footer>
          <span>
            © 2021{" "}
            <a style={{ color: "inherit" }} href="https://mryhryki.com/">
              mryhryki
            </a>
          </span>
        </footer>
        <script src="/assets/script/copy_to_clipboard.js" />
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </>
  );
};
