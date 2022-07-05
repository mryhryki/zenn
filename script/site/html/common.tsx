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
      <a style={{ marginRight: "0.5rem" }} href="/blog/">一覧</a>
      <span>
        {"©2021 "}
        <a style={{ color: "inherit" }} href={BaseURL}>mryhryki</a>
      </span>
    </footer>
  );
};
