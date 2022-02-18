import React from "react";
import ReactDOMServer from "react-dom/server";
import { Post } from "./post";
import { convert } from "@mryhryki/markdown";

const renderToHtml = (element: React.ReactElement): string => {
  const html = ReactDOMServer.renderToStaticMarkup(element);
  return `<!doctype html><html lang="ja">${html}</html>`;
};

interface HeadArgs {
  url: string;
  siteName: string;
  title: string;
  description: string;
  canonical?: string | null;
}

const renderHeadTag = (args: HeadArgs): React.ReactElement => {
  const { url, siteName, title, description, canonical } = args;
  return (
    <head>
      <meta charSet="UTF-8" />
      <base target="_blank" />
      <title>{title}</title>
      <meta content={title} name="title" />
      <meta content={description} name="description" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" href="/assets/image/icon_192x192.png" type="image/png" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://mryhryki.com/assets/image/share_image.jpg" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ja-JP" />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://mryhryki.com/assets/image/share_image.jpg" />
      <meta name="twitter:site" content="@mryhryki" />

      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&family=Roboto+Mono&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/assets/css/base.css" />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content={title} />
      <link rel="apple-touch-icon" type="image/png" href="./assets/image/icon_180x180.png" />

      {canonical != null && <link rel="canonical" href={canonical} />}
    </head>
  );
};

export const renderPost = (post: Post): string =>
  renderToHtml(
    <>
      {renderHeadTag({
        url: post.url,
        siteName: "mryhryki's blog",
        title: post.title,
        description: "Web技術や個人的なメモなどを投稿しています。",
        canonical: post.canonical,
      })}
      <body className="wrapper dark-theme">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: convert(post.markdown).html }} />
        {post.canonical != null && (
          <p>
            ※この記事は以下に投稿した記事のバックアップです。
            <a
              href="https://developer.mozilla.org/ja/docs/Web/HTML/Attributes/rel#attr-canonical"
              target="_blank"
              rel="noopener noreferrer"
            >
              canonical
            </a>{" "}
            も設定しています。
            <br />
            <a href={post.canonical}>{post.canonical}</a>
          </p>
        )}
        <footer>
          <a href="/blog/">一覧</a>
          <span>
            © 2021{" "}
            <a style={{ color: "inherit" }} href="https://mryhryki.com/">
              mryhryki
            </a>
          </span>
        </footer>
      </body>
    </>
  );

export const renderBlogIndex = (posts: Post[]): string =>
  renderToHtml(
    <>
      {renderHeadTag({
        url: "https://mryhryki.com/blog/",
        siteName: "mryhryki's blog",
        title: "mryhryki's blog",
        description: "Web技術や個人的なメモなどを投稿しています。",
      })}
      <body className="wrapper dark-theme">
        <h1>mryhryki&apos;s blog</h1>
        <p style={{ textAlign: "center" }}>Web技術や個人的なメモなどを投稿しています。</p>
        <p style={{ textAlign: "center" }}>※「View on XXX」とある記事は、他の媒体に投稿した内容のバックアップです。</p>

        {posts.map(({ id, title, createdAt, canonical }, index) => (
          <React.Fragment key={index}>
            {(index === 0 || createdAt.substring(0, 7) !== posts[index - 1].createdAt.substring(0, 7)) && (
              <h2>{createdAt.substring(0, 7)}</h2>
            )}
            <p>
              <a href={`/blog/${id}.html`}>{title}</a>
              <br />
              <span style={{ fontSize: "12px" }}>&#x1f4dd;{createdAt.substring(0, 10)}</span>
              {canonical != null && (
                <span style={{ fontSize: "12px" }}>
                  {" (View on "}
                  <a href={canonical} target="_blank" rel="noopener noreferrer">
                    {new URL(canonical).host}
                  </a>
                  )
                </span>
              )}
            </p>
          </React.Fragment>
        ))}
        <footer>
          <a href="/blog/">一覧</a>
          <span>
            © 2021{" "}
            <a style={{ color: "inherit" }} href="https://mryhryki.com/">
              mryhryki
            </a>
          </span>
        </footer>
      </body>
    </>
  );

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
      if (element != null && element.tagName === "SUMMARY" && element.id.length === 15) {
        history.replaceState(null, null, \`#\${element.id}\`)
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

        {posts.map(({ id, title, createdAt, markdown }, index) => (
          <React.Fragment key={index}>
            {(index === 0 || createdAt.substring(0, 7) !== posts[index - 1].createdAt.substring(0, 7)) && (
              <h2>{createdAt.substring(0, 7)}</h2>
            )}
            <details id={id} className="details-link">
              <summary id={id}>{title}</summary>
              <div dangerouslySetInnerHTML={{ __html: convert(markdown).html }} />
              <p>記録日: {createdAt.substring(0, 10)}</p>
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
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </>
  );
};
