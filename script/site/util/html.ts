import ejs from "ejs";
import path from "path";
import { Post } from "./post";
import { TemplateDir } from "./path";

export const renderPost = (title: string, html: string, canonical: string | null | undefined): Promise<string> =>
  new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve(TemplateDir, "post.ejs.html"), { title, html, canonical }, {}, (err, str) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(str);
      }
    });
  });

export const renderIndex = (posts: Post[]): Promise<string> =>
  new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve(TemplateDir, "index.ejs.html"), { posts }, {}, (err, str) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(str);
      }
    });
  });
