import React from "react";
import ReactDOMServer from "react-dom/server";
import { BaseURL } from "../util/definition";

export const renderToHtml = (element: React.ReactElement): string => {
  const html = ReactDOMServer.renderToStaticMarkup(element);
  return `<!doctype html><html lang="ja">${html}</html>`;
};

export const renderFooter = (): React.ReactNode => {
  return (
    <footer>
      <a style={{ marginRight: "1rem" }} href="/blog/">一覧</a>
      <a style={{ marginRight: "1rem" }} href="/doc/comment.html">コメント</a>
      <span>
        {"©2021 "}
        <a style={{ color: "inherit" }} href={BaseURL}>mryhryki</a>
      </span>
    </footer>
  );
};
