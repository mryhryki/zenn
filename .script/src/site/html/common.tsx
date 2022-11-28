import React from "react";
import ReactDOMServer from "react-dom/server";
import { BaseURL } from "../../common/definition";
import { Post } from "../../common/post/parse";

export const renderToHtml = (element: React.ReactElement): string => {
  const html = ReactDOMServer.renderToStaticMarkup(element);
  return `<!doctype html><html lang="ja">${html}</html>`;
};

export const renderFooter = (post: Post): React.ReactNode => {
  return (
    <footer>
      <a
        style={{ marginRight: "0.75rem" }}
        href="/Users/mryhryki/projects/personal/portfolio/.script/src/site/html/common"
      >
        ブログ一覧
      </a>
      <a
        style={{ marginRight: "0.75rem" }}
        href={`https://github.com/mryhryki/portfolio/tree/main${post.filePath}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHubで編集を提案
      </a>
      <a
        style={{ marginRight: "0.75rem", display: "inline-block" }}
        data-copytext={`# ${post.title}\n\n${post.markdown}`}
      >
        マークダウンをコピー
      </a>
      <span>
        {"©2021 "}
        <a style={{ color: "inherit" }} href={BaseURL}>mryhryki</a>
      </span>
      <script src="/assets/script/copy_to_clipboard.js" />
    </footer>
  );
};
