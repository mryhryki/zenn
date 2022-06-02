// import React from "react";
// import { Post } from "../util/post";
// import { convert } from "@mryhryki/markdown";
// import { renderHeadTag, renderToHtml } from "./common";
//

import { Post } from "../util/post";
import { renderHeadTag, renderToHtml } from "./common";
import { convert } from "@mryhryki/markdown";
import React from "react";

export const renderReadingLogPost = (post: Post): string =>
  renderToHtml(
    <>
      {renderHeadTag({
        url: post.url,
        siteName: "mryhryki's blog",
        title: post.title,
        description: "Web技術や個人的なメモなどを投稿しています。",
        canonical: post.canonical,
        useSyntaxHighlight: true,
      })}
      <body className="wrapper dark-theme">
        <h1>{post.title}</h1>
        {post.canonical != null && (
          <p style={{ textAlign: "center", fontSize: "12px" }}>
            （※この記事は <a href={post.canonical}>別媒体に投稿した記事</a> のバックアップです。
            <a
              href="https://developer.mozilla.org/ja/docs/Web/HTML/Attributes/rel#attr-canonical"
              target="_blank"
              rel="noopener noreferrer"
            >
              canonical
            </a>{" "}
            も設定しています）
          </p>
        )}
        <div dangerouslySetInnerHTML={{ __html: convert(post.markdown).html }} />
        <script
          src="https://giscus.app/client.js"
          data-repo="mryhryki/portfolio"
          data-repo-id="MDEwOlJlcG9zaXRvcnkxMTU5NzU1NjM="
          data-category="Announcements"
          data-category-id="DIC_kwDOBumli84COoZK"
          data-mapping="pathname"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="dark_dimmed"
          data-lang="ja"
          data-loading="lazy"
          crossOrigin="anonymous"
          async
        ></script>
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

// export const renderReadingLogIndex = (posts: Post[]): string => {
//   const title = "mryhryki's reading log";
//   const description = "読んだ記事や本などの記録です。";
//
//   const script = `
//   document.addEventListener('DOMContentLoaded', () => {
//     const id = new URL(location.href).hash.substring(1);
//     if (id !== '') {
//       const element = document.getElementById(id);
//       if (element != null) {
//         element.open = true;
//       }
//     }
//     document.addEventListener('click', (event) => {
//       const element = event.target;
//       if (element == null) return;
//       if (element.tagName === "SUMMARY" && element.id.length === 15) {
//         history.replaceState(null, null, \`#\${element.id}\`);
//       } else if (element.tagName === "BUTTON" && element.id === "open-all") {
//         Array.from(document.getElementsByTagName('details')).forEach((details) => details.open = true)
//       }
//     });
//   })`;
//
//   return renderToHtml(
//     <>
//       {renderHeadTag({
//         url: "https://mryhryki.com/reading_log/",
//         siteName: title,
//         title,
//         description,
//       })}
//       <body className="wrapper dark-theme">
//         <h1>{title}</h1>
//         <p style={{ textAlign: "center" }}>{description}</p>
//         <p style={{ textAlign: "center" }}>
//           <button id="open-all">全て開く</button>
//         </p>
//
//         {posts.map(({ id, title, createdAt, markdown }, index) => (
//           <React.Fragment key={index}>
//             {(index === 0 || createdAt.substring(0, 7) !== posts[index - 1].createdAt.substring(0, 7)) && (
//               <h2>{createdAt.substring(0, 7)}</h2>
//             )}
//             <details id={id} className="details-link">
//               <summary id={id}>{title}</summary>
//               <div dangerouslySetInnerHTML={{ __html: convert(markdown).html }} />
//               <p>
//                 記録日: {createdAt.substring(0, 10)}{" "}
//                 <button data-copytext={`## ${title}\n\n${markdown}`}>Copy Markdown</button>
//               </p>
//             </details>
//           </React.Fragment>
//         ))}
//         <footer>
//           <span>
//             © 2021{" "}
//             <a style={{ color: "inherit" }} href="https://mryhryki.com/">
//               mryhryki
//             </a>
//           </span>
//         </footer>
//         <script src="/assets/script/copy_to_clipboard.js" />
//         <script dangerouslySetInnerHTML={{ __html: script }} />
//       </body>
//     </>
//   );
// };
